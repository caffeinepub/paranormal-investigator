# Specification

## Summary
**Goal:** Add an email-restricted admin panel with content management and analytics tracking to the Oklahoma Paranormal Investigations site.

**Planned changes:**
- Add backend authentication that only allows a single hardcoded owner email to log in, returning a session token on success
- Add backend data models and CRUD functions for investigations, testimonials, and team members (admin-only writes, public reads)
- Add backend analytics to record page visit and form submission events, with an admin-only query returning aggregated counts
- Add a frontend admin login page at `/admin` with an email input; correct email grants access, any other email shows an error
- Add a protected admin dashboard at `/admin/dashboard` with tabbed content management panels (Investigations, Testimonials, Team Members) and an analytics panel
- Instrument existing pages (Home, Resources, CaseGallery, SubmitCase, Team) to report page visit events to the backend on mount, and report a submission event from SubmitCase on successful form submit

**User-visible outcome:** The site owner can navigate to `/admin`, enter their email to gain access, then manage all site content (add/edit/delete investigations, testimonials, and team members) and view page visit and form submission analytics from a protected dashboard.
