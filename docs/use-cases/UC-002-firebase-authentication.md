# UC-002: Firebase Authentication - Enable Cloud Sync

**Related PRD/TRD**: [PRD-005](../prd/PRD-005-firebase-auth.md), [TRD-005](../trd/TRD-005-firebase-auth.md)

**Actors**: All users (optional feature)

---

## Preconditions

- User is on dashboard or reader page
- User has not yet signed in (or is currently signed out)
- Internet connection available

## Main Flow

1. User clicks "Sign In" button in header or sees sign-in prompt
2. System displays SignInModal with "Sign in with Google" option
3. User clicks Google sign-in button
4. Browser redirects to Google authentication flow
5. User completes Google authentication
6. Firebase verifies credentials and creates/updates user profile
7. System stores auth token in secure local storage
8. System syncs all existing localStorage readings to Firestore under user's UID
9. System updates header UI to show user profile photo and email
10. System persists all future changes (readings, tags, settings) to Firestore automatically

## Postcondition

- User is authenticated and can access readings across devices
- User profile is visible in header (avatar + email)
- All readings and settings are synced to cloud
- User can sign out and sign back in to recover data

## Related Features

- Tags System: Tag changes sync across devices
- Settings: User preferences (fonts, theme, accessibility) sync across devices
- Auto-Advance Timer: Bookmarks and timer state sync across devices

---

## Variants

### Variant: Already Signed In, Switching Devices

1. User opens app on different device
2. User clicks Sign In
3. User signs in with same Google account
4. System fetches all readings and settings from Firestore
5. Dashboard displays all readings from previous device(s)

### Variant: Sign Out Flow

1. User clicks user menu in header
2. User selects "Sign Out"
3. System clears auth token and local user profile
4. System keeps localStorage readings but marks as "unsynced"
5. User can sign back in later to re-sync

---

← [Back to Use Cases Index](README.md)
