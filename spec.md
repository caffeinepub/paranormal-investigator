# Specification

## Summary
**Goal:** Fix the PIN authentication flow on the `/supernatural` page so it never gets stuck on "verifying access".

**Planned changes:**
- Rewrite the `SupernaturalPinLogin` component to validate the PIN `022025` purely client-side without any async backend or Internet Identity calls.
- On successful PIN entry, call the `AdminContext` login function and immediately redirect to the admin dashboard.
- On incorrect PIN entry, display an error message and stay on the login page.
- Remove any logic that could cause the "verifying access" state to hang indefinitely.

**User-visible outcome:** Entering the correct PIN on `/supernatural` immediately redirects to the admin dashboard without getting stuck. Incorrect PINs show an error message instantly.
