## ADDED Requirements

### Requirement: Graceful handling of invalid refresh token on startup
The system SHALL detect the `TOKEN_REFRESH_FAILED` auth event and transition to the unauthenticated state without throwing an unhandled error. It SHALL clear the stale token from persistent storage so that subsequent launches do not repeat the failure.

#### Scenario: App launches with expired refresh token
- **WHEN** the app starts and the stored refresh token is expired or revoked
- **THEN** the `TOKEN_REFRESH_FAILED` event is caught, the session is cleared, and the user is redirected to the login screen without a crash or red error screen

#### Scenario: Subsequent cold start after token was cleared
- **WHEN** the app starts after the stale token was already cleared by a previous `TOKEN_REFRESH_FAILED` handling
- **THEN** the app launches in the unauthenticated state normally, with no auth error
