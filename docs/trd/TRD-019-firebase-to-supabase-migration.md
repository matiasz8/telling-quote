# TRD-019: Firebase to Supabase Database Migration - Technical Implementation

**Status:** Approved for Implementation  
**Priority:** High  
**Owner:** @matiasz8  
**Created:** July 25, 2026  
**Last Updated:** July 25, 2026

---

## Overview

Technical implementation plan for migrating tellingQuote from Firebase/Firestore to Supabase (PostgreSQL). Includes database schema, API routes, real-time subscriptions, offline sync queue, data migration strategy, and zero-downtime cutover plan.

---

## Related PRD

**PRD-019:** Firebase to Supabase Database Migration  
- See `/docs/prd/PRD-019-firebase-to-supabase-migration.md` for business requirements, success metrics, and timeline
- This TRD provides the technical implementation details

---

## Implementation

### Phase 1: Environment Setup (Week 1, 16 hours)

#### 1.1 Supabase Project Creation
- [ ] Create Supabase project (prod region: us-east-1)
- [ ] Enable real-time subscriptions
- [ ] Configure JWT secret (use Firebase or generate new)
- [ ] Create database: `tellingquote_prod`
- [ ] Store secrets in `.env.local`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`

**Files Affected:** `.env.local.example`

#### 1.2 Database Schema Migration
- [ ] Create `readings` table with version/conflict detection
- [ ] Create `sentences` table (nested readings content)
- [ ] Create `audit_logs` table (change history)
- [ ] Create `sync_metadata` table (client sync state)
- [ ] Add indexes: user_id, updated_at, is_completed, tags (GIN), search_vector
- [ ] Create RLS policies (users access own readings only)

**Files Affected:** `scripts/migrations/001_create_schema.sql`

#### 1.3 Triggers & Functions
- [ ] Auto-update `updated_at` on every change
- [ ] Auto-log changes to `audit_logs` table
- [ ] Soft-delete: mark deleted_at, not permanent removal
- [ ] Full-text search: tsvector index on title + content

**Files Affected:** `scripts/migrations/002_create_triggers.sql`

#### 1.4 Real-Time Subscriptions
- [ ] Enable PostgreSQL LISTEN/NOTIFY
- [ ] Configure Supabase realtime filters
- [ ] Set up WebSocket connection pooling

**Files Affected:** Supabase dashboard configuration

---

### Phase 2: API Routes & Client SDK (Week 1-2, 24 hours)

#### 2.1 Create API Routes (Next.js)
- [ ] `POST /api/readings` → create reading with deduplication
- [ ] `GET /api/readings/[id]` → get single reading
- [ ] `PUT /api/readings/[id]` → update with version check (conflict detection)
- [ ] `DELETE /api/readings/[id]` → soft delete
- [ ] `GET /api/readings` → get all readings (paginated)
- [ ] `POST /api/readings/search` → full-text search
- [ ] `GET /api/readings/export?format=json|csv` → bulk export

**Files:** Create `app/api/readings/route.ts`, `app/api/readings/[id]/route.ts`, etc.

#### 2.2 Middleware: Auth + Deduplication
- [ ] Auth middleware: verify JWT, extract user_id
- [ ] Dedup middleware: check client_id to prevent duplicate inserts
- [ ] Error handler: format errors consistently (`{ success, error: { code, message, retryable } }`)

**Files:** `app/api/middleware/auth.ts`, `app/api/middleware/dedup.ts`

#### 2.3 Supabase Client SDK
- [ ] Initialize: `@supabase/supabase-js` in client and server
- [ ] Configure: Real-time subscriptions
- [ ] Export: Typed client functions for CRUD

**Files:** `lib/supabase/client.ts`, `lib/supabase/server.ts`

---

### Phase 3: Client-Side Sync Hook (Week 2, 20 hours)

#### 3.1 New useReadingSync Hook
- [ ] Retry logic: exponential backoff (250ms, 500ms, 1s) × 3 attempts
- [ ] Offline detection: check `navigator.onLine`
- [ ] Status tracking: 'idle' | 'syncing' | 'synced' | 'error' | 'offline' | 'conflict'
- [ ] Real-time subscriptions: listen to readings table changes
- [ ] Conflict handling: detect 409, fetch latest, merge locally

**Files:** `hooks/useReadingSync.ts` (new version)

#### 3.2 IndexedDB Offline Queue
- [ ] Create `OfflineSyncQueue` class
- [ ] Store operations: `{ id, operation, data, timestamp, retries }`
- [ ] Retrieve all pending operations on network return
- [ ] Remove from queue after successful sync

**Files:** `lib/offline/offlineSyncQueue.ts`

#### 3.3 Conflict Resolution UI
- [ ] Show toast: "Reading was updated. Tap to merge."
- [ ] Modal: Show server version vs. client version
- [ ] Allow user to choose/merge
- [ ] Auto-retry sync after merge

**Files:** `components/ConflictMergeModal.tsx`

---

### Phase 4: Data Migration (Week 2, 12 hours)

#### 4.1 Export Firebase Data
- [ ] Use Firebase CLI or Admin SDK to export all readings
- [ ] Format: JSON with uid mapping

```typescript
// Example
[
  {
    uid: "user-123",
    readings: [
      { id: "read-1", title: "...", content: "...", createdAt, updatedAt, tags: [] },
      { id: "read-2", title: "...", content: "...", createdAt, updatedAt, tags: [] }
    ]
  }
]
```

**Files:** `scripts/migrate-firebase.ts`

#### 4.2 Transform & Validate
- [ ] Transform Firebase schema to Supabase schema
- [ ] Add: version=1, source_of_truth='firebase', client_id=null
- [ ] Validate: checksums, record counts

**Files:** `scripts/migrate-firebase.ts` (transform logic)

#### 4.3 Bulk Insert
- [ ] Insert all readings into Supabase in batches (1000 rows/batch)
- [ ] Verify: row count before/after
- [ ] Check: no duplicates or corruption

```typescript
// Pseudo
const batches = chunk(transformedReadings, 1000);
for (const batch of batches) {
  await supabase.from('readings').insert(batch);
}
```

**Files:** `scripts/migrate-firebase.ts` (insert logic)

#### 4.4 Validation
- [ ] Sample audit: 100 random readings, compare Firebase vs Supabase
- [ ] Verify: all tags present, content intact
- [ ] Check: orphaned records in Supabase

**Files:** `scripts/validate-migration.ts`

---

### Phase 5: Dual-Write Testing (Week 2-3, 16 hours)

#### 5.1 Deploy Dual-Write Code
- [ ] Feature flag: `SUPABASE_WRITE_ENABLED` (initially false)
- [ ] When enabled: write to Firebase AND Supabase
- [ ] Monitor: divergence between systems
- [ ] Log: all dual-write operations for audit

**Files:** `lib/supabase/dualWrite.ts`, `.env.local`

#### 5.2 Read Validation Tests
- [ ] Create reading on staging
- [ ] Verify: readable from both Firebase and Supabase
- [ ] Verify: real-time sync to other browser tab
- [ ] Verify: offline create queues, then syncs

**Files:** `e2e/migration.spec.ts`

#### 5.3 Conflict Testing
- [ ] Concurrent edits: phone + laptop same time
- [ ] Expected: conflict detected, user prompted to merge
- [ ] Offline + online: changes sync when online

**Files:** `e2e/conflict.spec.ts`

---

### Phase 6: Read Switchover (Week 3, 12 hours)

#### 6.1 Canary Deploy (10% Read Traffic)
- [ ] Route 10% of reads to Supabase
- [ ] Monitor: latency, errors, data consistency
- [ ] Compare: results match Firebase (spot check)
- [ ] Duration: 24 hours

#### 6.2 Ramp Deploy (50% Read Traffic)
- [ ] Increase to 50% reads from Supabase
- [ ] Monitor: latency p95, error rate
- [ ] Compare: data consistency spot checks
- [ ] Duration: 48 hours

#### 6.3 Full Switchover (100% Reads)
- [ ] All reads from Supabase
- [ ] Disable dual-write (writes still go to Firebase for safety)
- [ ] Monitor: all metrics
- [ ] Duration: 1 week before disabling Firebase

**Files:** `app/api/readings/route.ts` (route logic)

---

### Phase 7: Firebase Shutdown (Week 4, 8 hours)

#### 7.1 Disable Firebase Writes
- [ ] Stop writing to Firebase
- [ ] Monitor: Supabase error rate
- [ ] Check: user complaints

#### 7.2 Keep Firebase as Rollback
- [ ] Leave Firebase project active
- [ ] Disable read access, keep data
- [ ] Ready for 1-week emergency rollback

#### 7.3 Cleanup & Archive
- [ ] After 1 week: delete Firebase project
- [ ] Archive Firebase rules for reference
- [ ] Document: how to restore Firebase from backup (just in case)

**Files:** Keep `firestore.rules` archived in docs/

---

## Testing

### Unit Tests (12 hours)

```typescript
// tests/api/readings.test.ts
describe('POST /api/readings', () => {
  it('should create reading with deduplication', async () => {
    const res1 = await fetch('/api/readings', { method: 'POST', body: JSON.stringify({ title: 'Test', clientId: 'c1' }) });
    expect(res1.status).toBe(200);

    // Same clientId → duplicate
    const res2 = await fetch('/api/readings', { method: 'POST', body: JSON.stringify({ title: 'Test', clientId: 'c1' }) });
    expect(res2.status).toBe(409);  // Conflict
    expect(res2.json().error.code).toBe('DUPLICATE');
  });

  it('should handle conflicts on PUT (version check)', async () => {
    // Create at version 1
    const reading = await createReading({ title: 'Initial' });
    expect(reading.version).toBe(1);

    // Try to update with wrong version
    const res = await fetch(`/api/readings/${reading.id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated', version: 0 })  // Wrong!
    });
    expect(res.status).toBe(409);  // Conflict
  });
});
```

**Files:** `tests/api/readings.test.ts`, `tests/hooks/useReadingSync.test.ts`

### Integration Tests (12 hours)

```typescript
// tests/integration/sync.test.ts
describe('Full Sync Flow', () => {
  it('should sync offline changes when network returns', async () => {
    const queue = new OfflineSyncQueue();
    await queue.init();

    // Simulate offline
    const op = { id: uuid(), operation: 'create', data: { title: 'Offline' } };
    await queue.add(op);
    expect(await queue.getAll()).toHaveLength(1);

    // Simulate network return
    await processOfflineQueue();
    expect(await queue.getAll()).toHaveLength(0);
  });

  it('should subscribe to real-time updates', async (done) => {
    const unsubscribe = subscribeReadings((readings) => {
      expect(readings).toContainEqual({ title: 'Real-time update' });
      unsubscribe();
      done();
    });

    // Create reading (should trigger subscription)
    await createReading({ title: 'Real-time update' });
  });
});
```

**Files:** `tests/integration/sync.test.ts`

### E2E Tests (16 hours)

```typescript
// e2e/sync.spec.ts
test('create reading → sync → verify in DB → delete → verify soft-delete', async ({ page }) => {
  // Create
  await page.goto('/');
  await page.fill('input[placeholder="Title"]', 'E2E Test Reading');
  await page.click('button:has-text("Create")');

  // Verify created
  await expect(page.locator('text=E2E Test Reading')).toBeVisible();

  // Verify in Supabase
  const reading = await db.query('SELECT * FROM readings WHERE title = $1', ['E2E Test Reading']);
  expect(reading.rows).toHaveLength(1);

  // Delete
  await page.click('button:has-text("Delete")');

  // Verify soft-delete
  const deleted = await db.query('SELECT * FROM readings WHERE title = $1 AND deleted_at IS NOT NULL', ['E2E Test Reading']);
  expect(deleted.rows).toHaveLength(1);
});

test('offline create → online sync', async ({ page, context }) => {
  // Go offline
  await context.setOffline(true);
  
  // Create reading
  await page.goto('/');
  await page.fill('input[placeholder="Title"]', 'Offline Reading');
  await page.click('button:has-text("Create")');
  
  // Should show "offline" indicator
  await expect(page.locator('text=Offline')).toBeVisible();

  // Go online
  await context.setOffline(false);
  
  // Should auto-sync
  await page.waitForTimeout(1000);
  await expect(page.locator('text=Synced')).toBeVisible();
});
```

**Files:** `e2e/migration.spec.ts`, `e2e/conflict.spec.ts`

### Load Testing (8 hours)

```bash
# Test: 1000 concurrent sync operations
# Target: p95 latency < 200ms, 99% success rate

artillery run load-test.yml --target https://staging.tellingquote.com
```

**Files:** `load-tests/load-test.yml`

---

## Deployment Plan

### Pre-Deployment Checklist
- [ ] All tests pass (unit, integration, E2E)
- [ ] Performance tests: p95 latency < 200ms ✓
- [ ] RLS policies tested all scenarios ✓
- [ ] Backup Firebase data ✓
- [ ] Rollback procedure documented ✓
- [ ] Monitoring alerts set up (Sentry, Datadog) ✓

### Deployment Steps
1. [ ] Enable feature flag: `SUPABASE_WRITE_ENABLED=true`
2. [ ] Deploy dual-write code
3. [ ] Monitor: error rate, divergence (24h)
4. [ ] Verify: Firebase ↔ Supabase data consistency (spot check 100 readings)
5. [ ] Enable: `SUPABASE_READ_ENABLED=true` (canary 10%)
6. [ ] Monitor: latency, errors (24h)
7. [ ] Ramp: to 50%, then 100%
8. [ ] Disable Firebase writes after 1 week stable
9. [ ] Delete Firebase project after 30 days

### Rollback Plan (If Issues)
- **Immediate (< 5 min):** Flip `SUPABASE_READ_ENABLED=false`, read from Firebase
- **Verify:** Error rates return to normal
- **Investigate:** Root cause in logs
- **Fix:** Apply patch
- **Re-test:** Staging end-to-end before re-enabling

---

## Monitoring & Observability

### Key Metrics
- Sync success rate (% of operations succeeding on first try)
- Sync error rate (% failures)
- Sync latency p95 (< 200ms target)
- Conflict rate (% of operations hitting version conflict)
- Offline queue size (should be 0 if sync working)
- Real-time notification latency (< 1s target)

### Error Tracking
- Log to Sentry: all sync errors with context (clientId, isOnline, queueSize)
- Dashboard: error breakdown by operation (create/update/delete)
- Alerts: if sync error rate > 1%, page oncall

**Files:** `lib/monitoring/syncMetrics.ts`, `.env.local` (Sentry DSN)

---

## Rollback & Recovery Procedures

### Point-in-Time Recovery
```sql
-- If data corrupted, restore deleted reading from audit log
SELECT (after_state) FROM audit_logs
WHERE operation = 'INSERT' AND row_id = 'reading-123'
LIMIT 1;

-- Restore by copying after_state back to readings table
```

### Full Database Restore
```bash
# If catastrophic failure: restore from Supabase daily backup
# Navigate to: Supabase dashboard → Backups → Restore
```

---

## Affected Files Summary

| File | Change | Type |
|------|--------|------|
| `app/api/readings/route.ts` | New API endpoints | Create |
| `app/api/readings/[id]/route.ts` | New API endpoints | Create |
| `hooks/useReadingSync.ts` | Rewrite for Supabase | Modify |
| `lib/supabase/client.ts` | New Supabase client | Create |
| `lib/offline/offlineSyncQueue.ts` | New offline queue | Create |
| `components/ConflictMergeModal.tsx` | New conflict UI | Create |
| `.env.local` | Add Supabase secrets | Modify |
| `scripts/migrate-firebase.ts` | Data migration script | Create |
| `e2e/migration.spec.ts` | New E2E tests | Create |

---

## Architecture Diagrams

```
Before (Firebase)
┌─────────────────────────────────────┐
│        Client (Next.js + React)     │
├─────────────────────────────────────┤
│     useReadingSync Hook (buggy)     │
│         (silent failures)           │
├─────────────────────────────────────┤
│      Firebase SDK (no retry logic)  │
│     (Firestore CRUD direct)         │
├─────────────────────────────────────┤
│        Firestore (NoSQL)            │
│  (no audit logs, soft delete)       │
└─────────────────────────────────────┘

After (Supabase)
┌─────────────────────────────────────┐
│        Client (Next.js + React)     │
├─────────────────────────────────────┤
│    useReadingSync Hook (robust)     │
│  (retry, offline queue, conflicts)  │
├─────────────────────────────────────┤
│      Next.js API Routes             │
│  (dedup, conflict resolution)       │
├─────────────────────────────────────┤
│    Supabase Client + RLS Policies   │
│     (real-time WebSocket)           │
├─────────────────────────────────────┤
│   PostgreSQL + Triggers             │
│ (audit_logs, soft delete, FTS)      │
└─────────────────────────────────────┘
```

---

## Related Documentation

- **PRD-019:** `/docs/prd/PRD-019-firebase-to-supabase-migration.md`
- **Sync Analysis:** `/docs/SYNC_FAILURE_ANALYSIS.md`
- **Architecture:** `/docs/Architecture-Overview.md`
- **API Docs:** (generated from OpenAPI spec after implementation)

---

## Sign-Off

| Role | Approval |
|------|----------|
| Technical Lead | ___ |
| Database Architect | ___ |
| Date | ___ |
