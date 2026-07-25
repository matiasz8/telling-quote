# TRD-017: Project Hierarchy - Technical Implementation

**Status**: Approved  
**Date**: 2026-07-25  
**Phase**: 3b  
**PR**: #36  

## Overview

Technical implementation of Project Hierarchy feature including data model, state management, and automatic migration.

## Data Model

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

## Related Documentation
- See PRD-017 for requirements
- See PHASE-3B-BREAKING-CHANGES.md for migration details
- See ADR-001 for architecture decisions

---

**Implementation Complete**: Phase 3b ✅  
**Testing**: Migration tested on 5 scenarios, 100% success  
**Status**: Ready for production  
