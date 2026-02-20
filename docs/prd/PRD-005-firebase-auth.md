# PRD-005: Firebase Authentication & Cloud Sync

**Status**: ✔️ Completed  
**Priority**: Medium  
**Owner**: TBD  
**Created**: November 20, 2025  
**Last Updated**: February 20, 2026

---

## Overview

Implement optional Google authentication via Firebase to enable cross-device syncing of readings and settings while maintaining the ability to use the app anonymously with localStorage.

---

## Problem Statement

Currently, tellingQuote stores all data in browser localStorage:

**Problems**:

1. **Data loss risk**: Clearing browser cache = lost readings
2. **No cross-device sync**: Can't access readings from phone/tablet/work computer
3. **No backup**: No way to export/restore readings
4. **Single browser limitation**: Data siloed per browser

**User Pain Points**:

- "I cleared my browser and lost everything!"
- "I want to read on my phone during commute"
- "Can't access my study materials from library computer"

---

## Goals & Objectives

### Primary Goals

- Enable optional Google sign-in
- Sync readings across devices
- Maintain offline-first functionality
- Preserve privacy (no forced account)

### Secondary Goals

- Backup readings to cloud
- Future: collaboration/sharing
- Analytics (optional, privacy-respecting)

### Non-Goals

- Email/password authentication (v1)
- Social sharing features (v1)
- Public reading library (v1)

### Success Metrics

- 30-40% sign-up rate among active users
- 70%+ of signed-in users use multiple devices
- Zero data loss incidents
- < 2 second sync time

---

## User Stories

**As a student**  
I want to sync my study materials across laptop and phone  
So that I can review anywhere

**As a commuter**  
I want to read on phone during travel and continue on desktop at home  
So that I don't lose my place

**As a privacy-conscious user**  
I want to use the app without signing in  
So that my data stays local

**As an existing user**  
I want my localStorage readings to migrate when I sign in  
So that I don't lose my existing content

**As a multi-device user**  
I want changes to sync automatically  
So that I don't have to manually export/import

---

## Requirements

### Functional Requirements

#### FR-1: Anonymous Mode (Default)

**Behavior**:

- App works exactly as now (localStorage)
- No account required
- "Sign In" button visible in header
- Optional: Banner suggesting sync benefits

**Data Flow**:

```bash
User → localStorage → Local browser only
```

#### FR-2: Google Sign-In

**Implementation**:

- Firebase Authentication
- Google OAuth provider
- "Sign in with Google" button
- Button locations:
  - Header (always visible)
  - Optional: First-time modal
  - Settings page

**User Flow**:

```bash
User clicks "Sign In with Google"
    ↓
Firebase OAuth popup
    ↓
User authenticates with Google
    ↓
App receives user token
    ↓
Migrate localStorage to Firestore
    ↓
Enable sync
```

#### FR-3: Data Migration on First Sign-In

**Process**:

1. User signs in for first time
2. Check if localStorage has data
3. If yes, show migration modal:

   ```bash
   "We found X readings on this device.
   Do you want to sync them to your account?"
   
   [Yes, Sync] [No, Start Fresh]
   ```

4. If "Yes, Sync":
   - Upload all localStorage readings to Firestore
   - Mark as synced
5. If "No, Start Fresh":
   - Clear localStorage
   - Start with empty account

**Edge Cases**:

- Account has data + localStorage has data → Merge or choose?
- Proposal: Merge with duplicate detection

#### FR-4: Cloud Storage (Firestore)

**Data Structure**:

```bash
users/
  {uid}/
    profile/
      - email
      - displayName
      - photoURL
      - createdAt
      - lastSeen
    
    readings/
      {readingId}/
        - id
        - title
        - content
        - tags: []
        - createdAt
        - updatedAt
        - isCompleted: boolean
    
    settings/
      - fontFamily
      - fontSize
      - theme
      - accessibility: {}
      - updatedAt
```

**Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

#### FR-5: Real-Time Sync

**Behavior**:

- Changes sync automatically when online
- Firestore real-time listeners
- Optimistic UI updates

**Sync Logic**:

```typescript
// On create/update/delete reading
if (user.isSignedIn) {
  // 1. Update local state immediately
  updateLocalState(reading);
  
  // 2. Sync to Firestore
  await syncToFirestore(reading);
} else {
  // Just update localStorage
  updateLocalStorage(reading);
}
```

**Conflict Resolution**:

- Last-write-wins (simple v1)
- Use `updatedAt` timestamps
- Future: Operational Transforms for true conflict resolution

#### FR-6: Offline Support

**Requirements**:

- App works offline always
- Firestore offline persistence enabled
- Queue writes when offline
- Sync when back online

**Implementation**:

```typescript
const db = firebase.firestore();
db.enablePersistence({ synchronizeTabs: true });
```

**User Feedback**:

- Show sync status indicator
- "Synced ✓" / "Syncing..." / "Offline ⚠️"

#### FR-7: Sign Out

**Process**:

1. User clicks "Sign Out"
2. Confirmation modal:

   ```bash
   "Sign out?
   
   Your readings will remain synced in the cloud
   but won't be accessible on this device until
   you sign in again.
   
   [Cancel] [Sign Out]"
   ```

3. On confirm:
   - Sign out from Firebase
   - Clear localStorage (optional)
   - Redirect to empty dashboard

**Options**:

- "Keep local copy" checkbox
- If checked, keep localStorage after sign-out

#### FR-8: Account Deletion

**Process**:

1. Settings → "Delete Account"
2. Serious warning modal
3. Type confirmation ("DELETE")
4. Delete all Firestore data
5. Delete Firebase Auth account
6. Clear localStorage
7. Redirect to homepage

**GDPR Compliance**:

- Complete data deletion
- Confirmation email
- 30-day grace period (optional)

---

### Non-Functional Requirements

#### NFR-1: Security

**Authentication**:

- Firebase Auth handles tokens
- HTTPS only
- No passwords stored (OAuth only in v1)

**Data Protection**:

- Firestore security rules
- User data isolation
- No public access

#### NFR-2: Privacy

**Data Collection**:

- Only collect: email, name (from Google)
- No analytics without consent
- No third-party tracking
- Clear privacy policy

**User Control**:

- Export all data (JSON download)
- Delete account anytime
- Transparent data usage

#### NFR-3: Performance

**Sync Performance**:

- Initial sync < 5 seconds
- Incremental sync < 1 second
- Offline-first (no blocking)

**Costs** (Firebase Free Tier):

- Reads: 50K/day
- Writes: 20K/day
- Storage: 1GB
- Auth: Unlimited

**Scaling**: Should support 1000 active users on free tier

#### NFR-4: Reliability

**Error Handling**:

- Graceful fallback to localStorage
- Retry failed syncs
- User-friendly error messages

**Monitoring**:

- Firebase Analytics (optional)
- Error logging (Sentry/similar)
- Sync success rate

---

## UI/UX Design

### Sign-In Button (Header)

```bash
┌─────────────────────────────────────────┐
│  tellingQuote    [⚙️ Settings] [Sign In]│
└─────────────────────────────────────────┘

After sign-in:
┌────────────────────────────────────────┐
│  tellingQuote    [⚙️] [👤 Bob ▼]   │
└────────────────────────────────────────┘
```

### User Menu (Signed In)

```bash
┌──────────────────────┐
│  👤 Bob Bobby        │
│  bob@example.com     │
├──────────────────────┤
│  ⚙️ Settings         │
│  💾 Export Data      │
│  🔄 Sync Status      │
│  🚪 Sign Out         │
│  🗑️ Delete Account   │
└──────────────────────┘
```

### Sync Status Indicator

```bash
Dashboard Footer:
┌────────────────────────────────────────┐
│                                        │
│  [Readings Grid]                       │
│                                        │
│  ✓ Synced • Last sync: 2 min ago       │
└────────────────────────────────────────┘

or

│  🔄 Syncing... • 3 readings            │

or

│  ⚠️ Offline • Changes will sync later  │
```

---

## Technical Implementation

### Firebase Configuration

```typescript
// lib/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true });
```

### Custom Hooks

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  
  const signOut = () => firebaseSignOut(auth);
  
  return { user, loading, signInWithGoogle, signOut };
}

// hooks/useSync.ts
export function useSync() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  
  const syncReading = async (reading: Reading) => {
    if (!user) return;
    
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, `users/${user.uid}/readings`, reading.id), {
        ...reading,
        updatedAt: serverTimestamp(),
      });
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync failed:', error);
    }
  };
  
  return { syncStatus, syncReading };
}
```

---

## Migration Strategy

### Phase 1: Dual Mode (localStorage + Firestore)

- Anonymous users: localStorage only
- Signed-in users: Firestore + localStorage cache
- Both work independently

### Phase 2: Firestore Primary

- Signed-in users: Firestore is source of truth
- localStorage as cache only
- Offline-first architecture

---

## Out of Scope (v1)

- ❌ Email/password authentication
- ❌ Social features (sharing, public readings)
- ❌ Collaboration (multiple users per reading)
- ❌ Version history / revision tracking
- ❌ Reading statistics / analytics
- ❌ Mobile apps (native iOS/Android)

---

## Future Enhancements (v2+)

### Phase 2

- Email/password auth option
- Profile customization
- Reading statistics (time spent, completion rate)
- Export to PDF/EPUB

### Phase 3

- Share readings (read-only links)
- Collaborative readings (edit together)
- Public reading library
- Reading recommendations

---

## Open Questions

1. **Should we charge for sync after X readings?**
   - Proposal: Free unlimited for now, evaluate costs later

2. **Should we support multiple cloud providers?**
   - Proposal: Firebase only for v1

3. **Should we implement reading versioning?**
   - Proposal: Phase 2 (adds complexity)

4. **How to handle large readings (>1MB)?**
   - Firestore doc limit: 1MB
   - Proposal: Split into chunks if needed

---

## Security & Privacy

### Privacy Policy Updates Needed

Must add:

- What data we collect (email, name, readings)
- How we use it (sync only)
- Third parties (Firebase/Google)
- Data retention (as long as account exists)
- User rights (access, delete, export)
- Contact information

### GDPR Compliance

- ✅ Consent (explicit sign-in)
- ✅ Access (export data feature)
- ✅ Deletion (delete account)
- ✅ Portability (JSON export)

---

## Testing Plan

### Unit Tests

- Auth flows (sign-in, sign-out)
- Sync logic (create, update, delete)
- Conflict resolution
- Offline behavior

### Integration Tests

- localStorage → Firestore migration
- Multi-device sync
- Offline → online transitions

### User Acceptance Testing

- Sign-in flow (multiple browsers)
- Cross-device sync (laptop + phone)
- Offline usage
- Data migration accuracy

---

## Success Criteria

### MVP

- ✅ Google sign-in works
- ✅ Readings sync across devices
- ✅ Offline functionality maintained
- ✅ localStorage migration works
- ✅ Zero data loss
- ✅ < 2 second sync time

### Future

- 50%+ of users sign in
- Multi-device usage common
- High user satisfaction

---

## Dependencies

- Firebase project setup
- Environment variables configuration
- React Auth context
- Reading type update (add timestamps)
- All components update (auth UI)

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|

| Firebase costs exceed free tier | Medium | Monitor usage, implement pagination |
| Data loss during migration | High | Thorough testing, backups, rollback plan |
| Sync conflicts (simultaneous edits) | Medium | Last-write-wins for v1, CRDTs for v2 |
| Privacy concerns | High | Clear communication, optional sync |
| Firestore quota limits | Low | Efficient queries, caching |

---

## Timeline Estimate

- **Firebase Setup**: 1 day
- **Authentication**: 2 days
- **Firestore Integration**: 3 days
- **Migration Logic**: 2 days
- **UI Updates**: 2 days
- **Testing**: 3 days
- **Security Review**: 1 day
- **Total**: 14 days (3 weeks)

---

## Cost Estimate (Firebase)

**Free Tier Limits**:

- Auth: Unlimited
- Firestore: 50K reads, 20K writes, 1GB storage/day
- Hosting: 10GB storage, 360MB/day bandwidth

**Expected Usage (1000 active users)**:

- Reads: ~10K/day (within free tier ✅)
- Writes: ~5K/day (within free tier ✅)
- Storage: ~500MB (within free tier ✅)

**Scaling**: Should remain free for first 5K users

---

## Related Documents

- [TRD-005: Firebase Authentication & Sync Implementation](../trd/TRD-005-firebase-auth.md)
- [Privacy Policy](../../PRIVACY.md) (to be created)
- [Firebase Security Rules](../../firestore.rules) (to be created)
