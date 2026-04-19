## Context

`useAuthStore` registers a `supabase.auth.onAuthStateChange` listener on module load. When the app restarts with a stale/revoked refresh token in AsyncStorage, the Supabase client fires a `TOKEN_REFRESH_FAILED` event. The current listener ignores the event parameter and only inspects `session`, so the error propagates unhandled — crashing the app.

The fix is entirely contained in `src/stores/useAuthStore.ts`. No new dependencies, no schema changes.

## Goals / Non-Goals

**Goals:**
- Catch `TOKEN_REFRESH_FAILED` and transition to the unauthenticated state cleanly
- Clear the stale token from AsyncStorage so subsequent app launches don't re-trigger the error
- Reuse the existing layout routing logic (already handles `user === null`)

**Non-Goals:**
- Showing a custom "session expired" UI — redirecting to login is sufficient for MVP
- Handling other auth error events (e.g. `USER_DELETED`) — not observed in this project

## Decisions

### Handle `TOKEN_REFRESH_FAILED` in the existing listener

**Chosen:** Add a guard at the top of `onAuthStateChange` that checks `event === 'TOKEN_REFRESH_FAILED'`, calls `supabase.auth.signOut()` (clears AsyncStorage), sets `{ user: null, sessionChecked: true, onboardingChecked: true }`, and returns early.

**Alternative — wrap `supabase.auth.getSession()` at bootstrap:** Would require adding an explicit session-fetch call in the layout or a new init action in the store. More invasive and duplicates what the listener already does.

**Alternative — global error boundary:** Too broad; auth errors are not always fatal and mixing them with render errors adds confusion.

### Call `supabase.auth.signOut()` on refresh failure

Calling `signOut()` is necessary to purge the invalid token from AsyncStorage. Without it, every subsequent cold start would attempt the refresh and fail again. `signOut()` itself triggers another `onAuthStateChange` call with `session = null`, which the existing `else` branch already handles correctly — no double-set risk because `sessionChecked` will already be `true` after the early return.

## Risks / Trade-offs

- **`signOut()` triggers a second `onAuthStateChange` call** → the `else` branch will re-set `user: null` redundantly but safely; no visible effect.
- **Race with ongoing network requests** → any in-flight Supabase queries after `signOut()` will get 401s; since `sessionChecked` is set immediately, the layout redirects to login before any authenticated screen can make requests.

## Migration Plan

1. Edit `src/stores/useAuthStore.ts` — add the `TOKEN_REFRESH_FAILED` guard.
2. Manual test: clear AsyncStorage manually (or use an expired project), relaunch — should land on login without a red screen.
3. No rollback complexity — one-line conditional, easily reverted.
