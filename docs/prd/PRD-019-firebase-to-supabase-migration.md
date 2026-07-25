# PRD-019: Firebase to Supabase Database Migration

**Status:** Approved  
**Priority:** High  
**Owner:** @matiasz8  
**Created:** July 25, 2026  
**Last Updated:** July 25, 2026

---

## Overview

Migrate tellingQuote from Firebase/Firestore to Supabase (PostgreSQL) to improve data reliability, enable advanced features, and fix critical sync bugs before launch. Zero downtime cutover with dual-write validation.

---

## Problem Statement

### Current Critical Issues

**A. Sync Reliability (Data Loss Risk)**
- Sync operations fail silently without error notification
- No mechanism to queue failed operations (offline)
- No conflict detection: concurrent edits cause data loss
- No audit trail to investigate what happened
- See: `docs/SYNC_FAILURE_ANALYSIS.md` for detailed root cause

**Example:** User creates reading offline → App closes → Reading lost forever (only in localStorage)

**B. Firebase Limitations**
- No built-in audit logging (manual implementation needed)
- Firestore costs unpredictable (per read/write, not per user)
- No full-text search capability
- Complex queries not supported
- Soft delete not supported (deleted data gone immediately)

**C. Feature Blockers**
- Can't implement: bulk export, usage analytics, advanced search
- Difficult to add: data recovery, audit history, team collaboration
- Real-time sync through WebSockets limited

**D. Scale Concerns**
- Current users: 0 production
- **When we launch**: Expected 100-1000 users
- **Problem**: Firebase costs will spike unpredictably
- **Fire**: We can't easily add analytics/reporting to understand user behavior

---

## Goals & Objectives

### Primary Goals
- **Reliability:** 99.9%+ sync success rate with deterministic error handling
- **Data Safety:** No data loss, 30-day soft-delete recovery, complete audit trail
- **Feature Unlock:** Enable full-text search, bulk export, usage analytics
- **Cost Predictability:** Predictable per-user costs instead of per-operation pricing

### Secondary Goals
- **Developer Experience:** Easier to debug sync issues with audit logs
- **User Experience:** Faster performance, better conflict resolution UI
- **Compliance:** Audit logs for future legal/compliance needs

---

## User Stories

**As a user creating offline**  
I want my readings to be queued and synced automatically when online  
So that I don't lose work

**As a user editing on 2 devices**  
I want conflicts to be detected and resolved  
So that I don't lose edits from one device

**As a user who deletes by mistake**  
I want to recover my reading within 30 days  
So that I can undo accidents

**As a product manager**  
I want to see usage analytics (most-used tags, avg. readings per user)  
So that I can understand user behavior

**As a developer debugging a user issue**  
I want to see an audit trail of all changes  
So that I can trace what happened

---

## Requirements

### Functional Requirements

#### FR-1: Reliable Sync with Retry Logic
- **Description:** All create/update/delete operations retry automatically with exponential backoff
- **Details:**
  - Max 3 retry attempts: 250ms, 500ms, 1s delays
  - Only retry on network/server errors, not on validation errors
  - Return explicit success/failure status (never silent fail)
  - Queue failed operations in IndexedDB for retry on network return
- **Acceptance Criteria:**
  - Sync operation returns `{ success: true, data }` or `{ success: false, error, retryable }`
  - Failed sync queued and retried when network returns
  - < 0.1% unrecovered sync failures (after 3 retries + manual queue processing)

#### FR-2: Conflict Detection & Resolution
- **Description:** Concurrent edits on same reading detected and handled
- **Details:**
  - Each reading has version number (optimistic locking)
  - Server rejects update if client version ≠ server version
  - Client detects conflict (409 response), fetches latest, merges locally
  - User shown: "Reading was updated elsewhere. Update your changes below" + merge UI
- **Acceptance Criteria:**
  - Concurrent edit on same field: conflict detected, not silently overwritten
  - User can see both versions and choose/merge
  - No data loss from either edit

#### FR-3: Soft Delete & Recovery
- **Description:** Deleted readings recoverable for 30 days
- **Details:**
  - Delete = set `deleted_at` timestamp, not permanent removal
  - UI: "Permanently delete?" option (confirms removal after 30 days)
  - Recovery: Admin can restore deleted reading within 30-day window
  - After 30 days: automatic permanent purge (via database job)
- **Acceptance Criteria:**
  - Deleted reading not visible in UI but stored in database
  - Can recover reading via admin interface (future feature)
  - After 30 days, automatic purge

#### FR-4: Real-Time Subscriptions
- **Description:** Changes on one device appear on other devices < 1 second
- **Details:**
  - Supabase RealtimeClient subscriptions on readings table
  - WebSocket push for INSERT/UPDATE/DELETE events
  - Only subscribed to user's own readings (RLS policy)
- **Acceptance Criteria:**
  - Create reading on phone, appears on laptop in < 1s
  - Update title on laptop, phone shows new title without refresh
  - Delete reading on one device, other devices remove it from UI

#### FR-5: Full-Text Search
- **Description:** Search readings by title/content
- **Details:**
  - PostgreSQL full-text search using tsvector
  - Supports: phrase search ("exact match"), AND/OR operators
  - Index on title + content columns
  - Max response time: < 500ms for 1000 readings
- **Acceptance Criteria:**
  - Query "react hooks" returns readings with both words
  - Query "react OR typescript" returns readings with either
  - Response time < 500ms (p95)

#### FR-6: Audit Logging
- **Description:** Complete history of all data changes
- **Details:**
  - Every change logged: user_id, table, operation, before_state, after_state, timestamp
  - 90-day retention policy (auto-purge after)
  - Accessible to admins only (future feature)
- **Acceptance Criteria:**
  - Every INSERT/UPDATE/DELETE creates audit log entry
  - Audit logs show before/after state (JSON diff)
  - Queries can answer: "What changed when?" "Who changed it?"

#### FR-7: Offline Sync Queue
- **Description:** Failed operations queued locally, retried when online
- **Details:**
  - IndexedDB storage: `{ operation, payload, timestamp, retries }`
  - Auto-retry on network return
  - Manual retry option in UI: "X changes pending, tap to retry"
- **Acceptance Criteria:**
  - Create 5 readings offline, all sync when online
  - Failed operations persist across app closes
  - UI shows sync queue status

### Non-Functional Requirements

#### NFR-1: Performance
- Single reading sync: < 100ms (p95)
- Bulk sync 100 readings: < 2s (p95)
- Real-time notification: < 200ms
- Search query: < 500ms (p95)

#### NFR-2: Reliability
- 99.9% sync success rate (with retries)
- 0% unrecovered data loss during migration
- Rollback to Firebase possible anytime during migration phase

#### NFR-3: Scalability
- Support 10,000+ readings per user
- Support 10,000 concurrent users
- Database backups daily (Supabase native)

#### NFR-4: Security
- Row-Level Security (RLS) policies: users can only access own readings
- All changes audited with user/timestamp/source
- No sensitive data in logs (passwords, auth tokens)

#### NFR-5: Compatibility
- Zero downtime during migration (dual-write phase)
- Existing readings fully migrated, no data loss
- All features work with PostgreSQL < 2 months old

---

## Success Metrics

### Immediate (Post-Migration)
- ✅ 100% data integrity (all readings migrated, 0 lost)
- ✅ 0 unrecovered sync failures (retries + offline queue)
- ✅ < 0.1% sync error rate on retry
- ✅ Real-time sync latency < 200ms (p95)

### 30-Day Post-Launch
- ✅ > 99% sync success rate
- ✅ 0 data loss incidents reported by users
- ✅ 0 "sync failed" support tickets
- ✅ User retention improved (no data loss = trust)

### Future Capability
- ✅ Full-text search reducing manual filtering time
- ✅ Usage analytics enabling product decisions
- ✅ Audit logs enabling debugging/compliance

---

## Out of Scope (Future Work)

- [ ] GraphQL API (REST only for MVP)
- [ ] Multi-region replication (single region)
- [ ] Team collaboration / shared readings
- [ ] Advanced permissions (admin roles)
- [ ] Time-series analytics (initial MVP)
- [ ] Data encryption at rest (use Supabase encryption)
- [ ] Mobile app native sync (Web MVP first)

---

## Dependencies

### Must Complete First
- None (greenfield migration)

### Blocks These Features
- None currently, but once migrated:
  - Analytics dashboard (can query Supabase)
  - Bulk export (can access Supabase directly)
  - Team collaboration (needs RLS redesign)

---

## Timeline

### Phase 1: Dual-Write (Week 1)
- Firebase remains source of truth
- All writes go to Firebase AND Supabase
- Read from Firebase only (validate Supabase)

### Phase 2: Read Switchover (Week 2)
- Start reading from Supabase
- Verify data consistency
- Keep dual-write active

### Phase 3: Firebase Shutdown (Week 3)
- Disable Firebase writes
- Monitor Supabase only
- Keep Firebase for emergency rollback

### Phase 4: Cleanup (Week 4)
- Delete Firebase data
- Remove Firebase SDK
- Archive Firebase rules

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Data loss during migration | Low | Critical | Backup, dual-write validation, checksum verification |
| Sync failures on new platform | Medium | High | Retry logic, offline queue, error alerts |
| Performance regression | Medium | High | Load tests, latency SLO monitoring |
| RLS policy bugs | Low | Critical | Test matrix all scenarios, manual review |
| Downtime during cutover | Low | Critical | Phased rollout, immediate rollback plan |

---

## Success Definition

**The feature is complete when:**
- ✅ All readings synced from Firebase to Supabase (0 loss)
- ✅ No sync failures for 24 hours in production
- ✅ All tests passing (unit, integration, E2E)
- ✅ Real-time subscriptions working
- ✅ Full-text search tested and working
- ✅ Audit logs being written
- ✅ Firebase cleanly shut down
- ✅ Documentation updated (FEATURE_INDEX, CHANGELOG)

---

## Related PRDs

None (first major infrastructure feature)

---

## Approval

| Role | Sign-off |
|------|----------|
| Product Owner (@matiasz8) | ___ |
| Technical Lead (@matiasz8) | ___ |
| Date | ___ |
