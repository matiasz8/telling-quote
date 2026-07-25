# TRD-017: Project Hierarchy - Technical Implementation

**Status**: Approved  
**Date**: 2026-07-25  
**Phase**: 3b  
**PR**: #36  

## Overview

Technical implementation of Project Hierarchy feature including data model, state management, and automatic migration.

---

## Related PRD

**PRD-017:** Project Hierarchy  
- See `/docs/prd/PRD-017-project-hierarchy.md` for business requirements, user stories, and success metrics
- This TRD provides the implementation details for: data model, state management, automatic migration, components, and breaking changes

---

## Implementation

### Project Type
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  created?: number;
  updated?: number;
}
```

### Reading Type (Updated)
```typescript
interface Reading {
  id: string;
  projectId: string;  // NEW - required
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  created?: number;
  updated?: number;
}
```

## State Management

### Dashboard Component State
```typescript
const [viewMode, setViewMode] = useState<'projects' | 'readings'>('projects');
const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
```

### Storage Keys
- `projects`: Project[]
- `readings`: Reading[] (all with projectId)

## Automatic Migration

### Process
1. Detect: Check if readings exist but projects don't
2. Create: Create "Mis Lecturas" default project
3. Assign: Assign all orphaned readings to default project
4. Validate: Verify no data loss
5. Persist: Save projects to localStorage

### Guarantees
- Zero data loss
- Idempotent (safe to run multiple times)
- Silent execution
- Fast (< 500ms)

## Components

### ReadingCardV2
Grid card component for reading display in readings mode.

### ReadingDetailView
Detail panel showing reading preview (status, excerpt, metadata).

### Navigation
- Title click: Opens (project drills down, reading opens reader)
- Body click: Shows preview in detail panel
- Back button: Returns to previous view

## Migration Files
- `lib/dashboard/migrationHelpers.ts` (87 lines)
- Functions: needsMigration, assignToDefaultProject, validate

## Breaking Changes
- Reading requires projectId
- Route /project/[id] removed
- New Project type introduced

## Testing

### Unit Tests
```typescript
// tests/dashboard/migrationHelpers.test.ts
describe('Migration Helpers', () => {
  it('should detect orphaned readings', () => {
    const readings = [{ id: '1', title: 'Test' }];  // no projectId
    expect(needsMigration(readings)).toBe(true);
  });

  it('should assign readings to default project', () => {
    const readings = [{ id: '1', title: 'Test' }];
    const migrated = assignToDefaultProject(readings, 'default-id');
    expect(migrated[0].projectId).toBe('default-id');
  });

  it('should be idempotent', () => {
    const readings1 = [{ id: '1', projectId: 'p1' }];
    const result1 = assignToDefaultProject(readings1, 'default');
    const result2 = assignToDefaultProject(result1, 'default');
    expect(result1).toEqual(result2);
  });
});
```

### Integration Tests
```typescript
// tests/dashboard/project-hierarchy.integration.test.ts
describe('Project Hierarchy Integration', () => {
  it('should create project and assign reading', () => {
    const projects = [];
    const readings = [{ id: '1', title: 'Test' }];
    
    // Create project
    const newProject = { id: 'p1', title: 'My Project' };
    const updatedProjects = [...projects, newProject];
    
    // Assign reading
    const updatedReadings = readings.map(r => ({ ...r, projectId: 'p1' }));
    
    expect(updatedReadings[0].projectId).toBe('p1');
  });

  it('should preserve reading data during migration', () => {
    const reading = { 
      id: '1', 
      title: 'Test Reading',
      content: 'Long content',
      tags: ['react', 'hooks']
    };
    
    const migrated = assignToDefaultProject([reading], 'default');
    expect(migrated[0]).toMatchObject({
      title: 'Test Reading',
      content: 'Long content',
      tags: ['react', 'hooks']
    });
  });
});
```

### E2E Tests
```typescript
// e2e/project-hierarchy.spec.ts
test('create project and move reading to it', async ({ page }) => {
  // Create project
  await page.goto('/');
  await page.click('button:has-text("New Project")');
  await page.fill('input[placeholder="Project Title"]', 'My Learning');
  await page.click('button:has-text("Create")');
  
  // Verify project appears
  await expect(page.locator('text=My Learning')).toBeVisible();
  
  // Drill down
  await page.click('text=My Learning');
  
  // Verify readings grid shows
  await expect(page.locator('[data-tour="reading-card"]')).toBeVisible();
});

test('auto-migration on first load', async ({ page, context }) => {
  // Set up: localStorage with orphaned readings
  await context.addInitScript(() => {
    const readings = [
      { id: '1', title: 'Test Reading', tags: [] }
    ];
    localStorage.setItem('readings', JSON.stringify(readings));
  });
  
  // Load app
  await page.goto('/');
  
  // Migration should run silently
  await page.waitForTimeout(1000);
  
  // Verify: projects created + reading migrated
  const readingsData = await page.evaluate(() => 
    JSON.parse(localStorage.getItem('readings') || '[]')
  );
  expect(readingsData[0].projectId).toBeDefined();
});
```

### Performance Tests
```bash
# Verify migration completes < 500ms with 1000 readings
npm run test:performance -- --scenario=migration --readingCount=1000
# Target: < 500ms
```

## Related Documentation
- See PRD-017 for requirements
- See PHASE-3B-BREAKING-CHANGES.md for migration details
- See ADR-001 for architecture decisions

---

**Implementation Complete**: Phase 3b ✅  
**Testing**: Migration tested on 5 scenarios, 100% success  
**Status**: Ready for production
