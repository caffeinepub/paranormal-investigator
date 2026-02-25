# Specification

## Summary
**Goal:** Fix admin permissions so the first logged-in user is automatically assigned as admin, and fix the "Failed to load cases" error in the Case Management panel.

**Planned changes:**
- Add an `initAdmin` update method in the backend that records the caller as admin if no admin has been set yet; store the admin principal in stable state so it persists across upgrades
- Update `getAllCases` (and other admin-gated methods) in the backend to verify the caller against the stored admin principal and return data successfully
- Update the frontend `CasesManager` and `useCaseQueries.ts` to call the admin-init endpoint on first authenticated load before fetching cases, handling failures gracefully if admin is already registered

**User-visible outcome:** The first user to log into the admin panel is automatically granted admin privileges, and the Case Management panel loads cases successfully without showing the "Failed to load cases" error banner.
