# Estrategia de Migración de Datos - Phase 3

**Fecha**: 2026-07-25  
**Estado**: 📋 Plan de Implementación

---

## 📊 Situación Actual

### Before (Phase 0-1):
```
Lecturas (planas, sin jerarquía):
- Reading {id, title, content, tags}
- Reading {id, title, content, tags}
- Reading {id, title, content, tags}
```

### After (Phase 2+):
```
Proyectos → Lecturas (jerárquico):
- Project {id, title, description, tags}
  ├── Reading {id, projectId, title, content, tags}
  ├── Reading {id, projectId, title, content, tags}
  └── ...
```

### Problem:
- Existing readings might not have `projectId` field
- Must maintain backward compatibility
- Must preserve all data during migration

---

## 🎯 Estrategia de Migración (Option A - Recommended)

### Step 1: Detection
```typescript
// lib/dashboard/migrationHelpers.ts

export function needsMigration(readings: Reading[]): boolean {
  return readings.some(r => !r.projectId);
}

export function getOrphanedReadings(readings: Reading[]): Reading[] {
  return readings.filter(r => !r.projectId);
}
```

### Step 2: Auto-Assignment to Default Project
```typescript
export function assignToDefaultProject(
  readings: Reading[],
  defaultProjectId: string
): Reading[] {
  return readings.map(r =>
    !r.projectId
      ? { ...r, projectId: defaultProjectId }
      : r
  );
}
```

**When**: On app startup, in useEffect
**Where**: app/page.tsx
**Trigger**: If orphaned readings detected

### Step 3: Smart Grouping (Optional Enhancement)
```typescript
export function groupReadingsByTag(
  readings: Reading[],
  existingProjects: Project[]
): { projects: Project[], readings: Reading[] } {
  const orphaned = getOrphanedReadings(readings);
  
  // Get unique tags from orphaned readings
  const tags = new Set<string>();
  orphaned.forEach(r => r.tags?.forEach(t => tags.add(t)));
  
  // Create projects for each tag
  const newProjects = Array.from(tags).map(tag => ({
    id: `project-${tag.toLowerCase().replace(/\s+/g, '-')}`,
    title: capitalizeFirst(tag),
    description: `Tema: ${tag}`,
    tags: [tag],
  }));
  
  // Assign readings to tag-based projects
  const migratedReadings = orphaned.map(r => {
    const primaryTag = r.tags?.[0];
    const projectId = primaryTag
      ? `project-${primaryTag.toLowerCase().replace(/\s+/g, '-')}`
      : 'default';
    return { ...r, projectId };
  });
  
  return {
    projects: [...existingProjects, ...newProjects],
    readings: migratedReadings,
  };
}
```

---

## 🔄 Implementation Approach

### Option A: Automatic (Recommended ✓)
```typescript
// In app/page.tsx useEffect

useEffect(() => {
  if (!mounted || projects.length === 0) return;
  
  const orphaned = readings.filter(r => !r.projectId);
  if (orphaned.length === 0) return;
  
  // Auto-assign to default project
  const migratedReadings = orphaned.map(r => ({
    ...r,
    projectId: DEFAULT_PROJECT.id,
  }));
  
  setReadings(prev => [
    ...prev.filter(r => r.projectId), // Already migrated
    ...migratedReadings, // Newly migrated
  ]);
}, [mounted, projects.length]);
```

**Pros**:
- Seamless user experience
- No user action required
- Preserves all data
- Fast migration

**Cons**:
- User might not understand where readings went
- No visibility into migration process

### Option B: Guided (With Dialog)
```typescript
// Show migration modal if orphaned readings found

useEffect(() => {
  if (!mounted) return;
  
  const orphaned = readings.filter(r => !r.projectId);
  if (orphaned.length === 0) return;
  
  // Show dialog: "Found X readings without projects"
  // Options: "Auto-organize by tags" / "Add to Mis Lecturas" / "Choose per reading"
  setShowMigrationDialog(true);
  setOrphanedCount(orphaned.length);
}, [mounted, readings]);
```

**Pros**:
- User sees what's happening
- Options for different strategies
- Educational (explains new structure)

**Cons**:
- More complex UI
- More code to maintain
- Slower for users with many readings

### Option C: Hybrid (Recommended Alternative)
```typescript
// Auto-migrate in background, but show notification

useEffect(() => {
  const orphaned = readings.filter(r => !r.projectId);
  if (orphaned.length === 0) return;
  
  // Auto-migrate silently
  const migratedReadings = orphaned.map(r => ({
    ...r,
    projectId: DEFAULT_PROJECT.id,
  }));
  setReadings(prev => [...prev.map(r =>
    !r.projectId ? { ...r, projectId: DEFAULT_PROJECT.id } : r
  )]);
  
  // Show toast: "Migrated X readings to 'Mis Lecturas'"
  showNotification({
    type: 'success',
    message: `✓ Migradas ${orphaned.length} lecturas a "Mis Lecturas"`,
    duration: 5000,
  });
}, [mounted, readings]);
```

**Pros**:
- Fast and seamless
- User informed
- No blocking UI
- Undo available via notifications

**Cons**:
- Toast component not yet implemented
- Requires notification system

---

## 📋 Implementation Plan

### Phase 3a: Core Migration Logic
```
1. Create lib/dashboard/migrationHelpers.ts
   - needsMigration()
   - getOrphanedReadings()
   - assignToDefaultProject()
   - groupReadingsByTag() [optional]

2. Add useEffect to app/page.tsx
   - Detect orphaned readings
   - Auto-assign to default project
   - Sync to Firebase if needed

3. Test with mock data
   - 0 orphaned readings → no change
   - 1 orphaned reading → assigned to default
   - 5 orphaned readings → all assigned
```

### Phase 3b: Optional Enhancements
```
1. Smart grouping by tags
   - Analyze reading tags
   - Create projects for major tags
   - Assign readings intelligently

2. Migration notification
   - Toast/notification component
   - Show migration status
   - Allow undo (optional)

3. Firebase migration
   - Update Firestore structure
   - Sync migrated readings
   - Handle conflicts
```

---

## 🔐 Data Safety Checks

### Before Migration:
```typescript
function validateBeforeMigration(readings: Reading[]): ValidationResult {
  return {
    totalReadings: readings.length,
    orphaned: getOrphanedReadings(readings).length,
    alreadyMigrated: readings.filter(r => r.projectId).length,
    missingFields: readings.filter(r => !r.title || !r.content),
  };
}
```

### After Migration:
```typescript
function validateAfterMigration(readings: Reading[]): ValidationResult {
  return {
    allMigrated: readings.every(r => r.projectId),
    orphaned: getOrphanedReadings(readings).length,
    dataLoss: readings.length < beforeMigration.length,
  };
}
```

### Firebase Validation:
```typescript
async function validateFirebaseMigration(uid: string): Promise<ValidationResult> {
  const cloudReadings = await getCloudReadings(uid);
  const localReadings = localStorage.getItem('readings');
  
  return {
    cloudCount: cloudReadings.length,
    localCount: JSON.parse(localReadings || '[]').length,
    orphanedInCloud: cloudReadings.filter(r => !r.projectId).length,
    synced: cloudReadings.every(r => r.projectId),
  };
}
```

---

## 🎯 Decision Matrix

| Scenario | Recommended | Why |
|---|---|---|
| **New User** | N/A | No migration needed |
| **User with <10 readings** | Option A (Auto) | Fast, no confusion |
| **User with 10-50 readings** | Option C (Hybrid) | Notification needed |
| **User with >50 readings** | Option B (Guided) | Deserves control |
| **Power User with tags** | Smart Grouping | Preserve organization |

---

## 💾 Backup Strategy

### Before Merging to Main:
```typescript
export function backupBeforeMigration() {
  const backup = {
    timestamp: new Date().toISOString(),
    readings: localStorage.getItem('readings'),
    projects: localStorage.getItem('projects'),
  };
  localStorage.setItem('backup_pre_migration', JSON.stringify(backup));
  return backup;
}

export function restoreFromBackup() {
  const backup = localStorage.getItem('backup_pre_migration');
  if (!backup) return false;
  
  const parsed = JSON.parse(backup);
  localStorage.setItem('readings', parsed.readings);
  localStorage.setItem('projects', parsed.projects);
  return true;
}
```

---

## 🧪 Test Cases

### Test 1: Zero Orphaned Readings
```
Given: readings = [{projectId: "p1", ...}, {projectId: "p2", ...}]
When: migration runs
Then: readings unchanged, no projects created
```

### Test 2: All Orphaned Readings
```
Given: readings = [{title: "r1"}, {title: "r2"}, {title: "r3"}]
When: migration runs
Then: all readings assigned to "default" project
```

### Test 3: Mixed Readings
```
Given: readings = [
  {projectId: "p1", title: "r1"},
  {title: "r2"},
  {projectId: "p1", title: "r3"},
  {title: "r4"}
]
When: migration runs
Then: r2 and r4 assigned to "default", r1 and r3 unchanged
```

### Test 4: Firebase Sync
```
Given: orphaned readings in local storage
When: user logs in and migration runs
Then: migrated readings synced to Firebase with projectId
```

---

## 📊 Rollout Plan

### Phase 3 Release (Recommended Timeline):

1. **Week 1**: Implement Option A (Auto-assignment)
   - Create migrationHelpers.ts
   - Add validation checks
   - Unit tests

2. **Week 2**: Add backup/restore
   - Test undo functionality
   - Document recovery process

3. **Week 3**: Optional - Smart grouping
   - Analyze user tags
   - Implement tag-based projects

4. **Week 4**: Deploy to production
   - A/B test if needed
   - Monitor issues
   - Gather user feedback

---

## ❓ Open Questions

1. **Smart grouping**: Should we analyze tags and create projects automatically?
   - **Recommendation**: Yes (opt-in via settings)

2. **Project naming**: What if multiple tags? Which one wins?
   - **Recommendation**: Primary tag (first in array)

3. **Backup retention**: How long to keep migration backup?
   - **Recommendation**: 7 days, then auto-delete

4. **Firebase**: How to handle readings already synced?
   - **Recommendation**: Mark with migration flag, update on next sync

5. **Notification**: Should migration be silent or show message?
   - **Recommendation**: Hybrid (silent + toast notification)

---

## 🚀 Next Step

**Recommendation**: Implement **Option A (Automatic Assignment)** first:
- Fast, simple, non-breaking
- Add to Phase 3a sprint
- Can enhance later with smart grouping

**Code Location**: 
- `lib/dashboard/migrationHelpers.ts` (new)
- `app/page.tsx` (useEffect addition)

**Estimated Effort**: 2-3 hours
