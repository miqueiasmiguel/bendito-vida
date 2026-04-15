## Context

`useQuizStore` and `useProgressStore` are plain Zustand stores with no persistence layer. The `profiles` table already has a `bioactive_profile JSONB` column (defined in `0001_initial_schema.sql` and typed in `src/types/database.ts`) that has never been written to. `fetchCheckins` exists in `useProgressStore` but is never called on boot. The auth flow already fetches the profile row on `onAuthStateChange` — it just ignores `bioactive_profile`.

## Goals / Non-Goals

**Goals:**
- Persist the calculated `NutritionProfile` to `profiles.bioactive_profile` when the quiz completes
- Rehydrate `useQuizStore.nutritionProfile` from Supabase on every app start (authenticated users)
- Call `fetchCheckins` once on tab mount so check-in state and evolution chart are correct from first render

**Non-Goals:**
- Offline / optimistic persistence (AsyncStorage, MMKV) — Supabase is the single source of truth
- Persisting quiz `answers` — only the computed profile is stored
- Migrating existing users who completed the quiz before this change (profile will be null; they see the "do quiz" state until they redo it, which is acceptable for MVP)

## Decisions

### D1 — Where to save `bioactive_profile`

**Choice:** Extend `markOnboardingComplete(profile: NutritionProfile)` to include `bioactive_profile` in the same `upsert` call.

**Rationale:** Single round-trip, atomic with `onboarding_completed`. No new Supabase call needed. The function is already async and awaited in `quiz.tsx`.

**Alternative considered:** A separate action `saveProfile(profile)` called after `markOnboardingComplete`. Rejected — two calls for what is one logical event (quiz done).

### D2 — Where to rehydrate `nutritionProfile`

**Choice:** Inside the existing `onAuthStateChange` callback in `useAuthStore`, after fetching the profile row, call `useQuizStore.getState().setProfile(data.bioactive_profile)` if the value is non-null.

**Rationale:** The auth store already fetches the profile row on every session start. Expanding the `select` to include `bioactive_profile` costs zero extra round-trips. The cross-store call (`useAuthStore` → `useQuizStore`) is a controlled side-effect at a known lifecycle point.

**Alternative considered:** Hydrate in `home.tsx` via a `useEffect`. Rejected — creates a visible loading gap on the home screen and duplicates the Supabase call that auth already makes.

### D3 — Where to call `fetchCheckins`

**Choice:** `useEffect` in `(tabs)/_layout.tsx` watching `user?.id`.

**Rationale:** Runs once before any tab screen renders. Both `home.tsx` and `progress.tsx` benefit immediately. Avoids duplicating the call across screens.

**Alternative considered:** Root `_layout.tsx`. Rejected — root layout already owns auth/onboarding boot; adding data-fetch responsibility there mixes concerns. The tabs layout is the natural scope for tab-level data.

### D4 — Type safety for `bioactive_profile`

`profiles.bioactive_profile` is typed as `Record<string, unknown> | null`. The rehydration cast from DB → `NutritionProfile` will use `as NutritionProfile` (trusted internal data, validated at write time). No runtime schema validation needed for MVP.

## Risks / Trade-offs

- **Cross-store coupling** (`useAuthStore` calling `useQuizStore.getState()`) → Acceptable one-way dependency. Auth is a higher-level concern that bootstraps app state. Document it with a comment.
- **Stale profile after re-quiz** → `markOnboardingComplete` overwrites `bioactive_profile` on upsert; subsequent quiz completions are always up to date.
- **fetchCheckins on every tab focus** → The `useEffect` with `user?.id` dep runs only on mount or when user changes, not on tab focus. No over-fetching.

## Migration Plan

No schema migration needed — `bioactive_profile` column already exists. Deploy is a code-only change. Existing users with `bioactive_profile = null` continue to see the quiz prompt until they redo the quiz.
