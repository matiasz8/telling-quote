# PRD-014: Reading Reactivation (Reactivar Lecturas Completadas)

**Status:** ✔️ Completed  
**Created:** February 2, 2026  
**Last Updated:** February 2, 2026  
**Owner:** Product Team  
**Priority:** Low  
**Related:** PRD-001 (Example Document), PRD-002 (Tags System)

---

## 1. Overview

### Purpose
Allow users to move completed readings back to the "Active" tab, enabling them to re-read or revisit content without having to recreate the reading from scratch.

### Background
Currently, when users finish a reading (reach the last slide), it automatically moves to the "Completed" tab. While this helps organize finished content, users may want to:
- Re-read important content
- Review materials for studying
- Practice speed reading on familiar text
- Revisit archived content

Without a reactivation feature, users must delete and recreate readings, losing metadata like creation dates and tags.

### Goals
1. Provide one-click reactivation for completed readings
2. Maintain data integrity (preserve title, content, tags, dates)
3. Use confirmation modal to prevent accidental reactivation
4. Consistent UX with existing delete/edit patterns

### Non-Goals
- Bulk reactivation (multiple readings at once)
- Reactivation history/undo
- Automatic re-completion detection
- Reading progress preservation

---

## 2. Problem Statement

### Current Pain Points

1. **No Way to Un-Complete**: Once completed, readings stay in "Completed" tab forever
2. **Must Delete & Recreate**: Users lose creation date, metadata
3. **Loss of Context**: Tags and reading history lost when recreating
4. **Friction for Re-Reading**: Common use case (studying, practicing) requires workarounds

### User Impact

**Without Reactivation:**
- Students can't easily review study materials
- Speed readers can't practice on same text
- Users lose metadata when re-reading content

**With Reactivation:**
- One click to move back to Active tab
- All metadata preserved
- Seamless re-reading experience

---

## 3. User Stories

### As a student
- I want to reactivate completed study materials so I can review them before exams
- I want to keep my original tags and creation date intact

### As a speed reader
- I want to reactivate finished articles to practice reading faster
- I want to track how many times I've re-read the same content

### As a researcher
- I want to revisit archived papers when they become relevant again
- I want to avoid recreating readings I've already organized with tags

---

## 4. Functional Requirements

### FR-1: Reactivate Button on Completed Reading Cards

**Location**: Completed readings in "Completed" tab

**Appearance**:
```tsx
<button
  onClick={handleReactivate}
  className="bg-linear-to-r from-emerald-500 to-teal-500"
  aria-label="Reactivar lectura"
  title="Reactivar lectura"
>
  <RefreshIcon /> {/* Circular arrows / rotate icon */}
</button>
```

**Behavior**:
- Button appears on hover (alongside Edit and Delete buttons)
- Only visible for completed readings
- Opens confirmation modal on click

### FR-2: Confirmation Modal

**Modal: ConfirmReactivateModal**

**Design**:
```tsx
{
  title: "Reactivar Lectura",
  icon: <RefreshIcon className="text-emerald-600" />,
  iconBackground: "bg-emerald-100",
  message: "¿Deseas mover '[title]' de nuevo a lecturas activas?",
  buttons: [
    { label: "Cancelar", variant: "secondary" },
    { label: "Reactivar", variant: "primary", gradient: "emerald-to-teal" }
  ]
}
```

**Keyboard Support**:
- `Enter`: Confirm reactivation
- `Esc`: Cancel and close modal
- `Tab`: Navigate between buttons

**Accessibility**:
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="reactivate-dialog-title"`
- Focus trap within modal
- Auto-focus on "Reactivar" button

### FR-3: Reactivation Logic

**Implementation**:
```typescript
function handleReactivateConfirm(readingId: string) {
  // Remove from completedReadings array in localStorage
  setCompletedReadings(prev => 
    prev.filter(id => id !== readingId)
  );
  
  // Reading automatically appears in Active tab
  // (filterlogic already exists in dashboard)
}
```

**Data Preserved**:
- ✅ Title
- ✅ Content
- ✅ Tags
- ✅ Creation date
- ✅ Reading ID
- ❌ Completion date (removed, reading is no longer complete)

**State Changes**:
- Reading removed from `completedReadings` array
- No changes to `readings` array (reading data intact)
- Dashboard automatically re-renders with reading in Active tab

---

## 5. Technical Specifications

### 5.1 Component Structure

**New Component:**
```
components/
  ConfirmReactivateModal.tsx  (107 lines)
```

**Modified Components:**
```
components/
  ReadingCard.tsx             (+28 lines)
    - Add onReactivate prop (optional)
    - Add reactivate button (conditional rendering)
    - Add handleReactivateClick handler

app/
  page.tsx                    (+26 lines)
    - Import ConfirmReactivateModal
    - Add isReactivateModalOpen state
    - Add reactivatingReading state
    - Expose setCompletedReadings (was read-only)
    - Add handleReactivate handler
    - Add handleReactivateConfirm handler
    - Pass onReactivate to ReadingCard
    - Render modal
```

### 5.2 State Management

**localStorage Schema (unchanged):**
```typescript
{
  "readings": [
    {
      id: "uuid",
      title: "Article Title",
      content: "Markdown content...",
      tags: ["tag1", "tag2"],
      createdAt: "2026-01-15T10:00:00Z"
    }
  ],
  "completedReadings": [
    "uuid-1",  // Array of reading IDs
    "uuid-2"
  ]
}
```

**Reactivation Effect:**
```typescript
// Before: Reading in completed
completedReadings: ["reading-1", "reading-2"]

// After reactivating "reading-1"
completedReadings: ["reading-2"]

// Result: "reading-1" now appears in Active tab
```

### 5.3 Modal Styling

**Inspiration**: ConfirmReactivateModal matches existing modal patterns

**Key Styles:**
```css
.modal-container {
  background: white;
  dark:background: gray-800;
  border-radius: 24px; /* Extra rounded */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.icon-container {
  width: 48px;
  height: 48px;
  background: emerald-100; /* Matches action color */
  border-radius: 50%;
}

.icon {
  color: emerald-600; /* Refresh icon */
}

.confirm-button {
  background: linear-gradient(to-right, emerald-600, teal-600);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
```

---

## 6. User Experience

### 6.1 Reactivation Flow

1. User opens dashboard
2. Clicks "Completed" tab
3. Sees list of finished readings
4. Hovers over a completed reading card
5. Three buttons appear:
   - 🔄 **Reactivar** (green gradient)
   - ✏️ Edit (blue/purple gradient)
   - 🗑️ Delete (red gradient)
6. Clicks "Reactivar" button
7. Modal opens: "¿Deseas mover '[title]' de nuevo a lecturas activas?"
8. Clicks "Reactivar" button in modal
9. Modal closes
10. Reading instantly appears in "Active" tab
11. User can continue reading from beginning

### 6.2 Visual Feedback

**Button States:**
- Default: Emerald gradient, subtle shadow
- Hover: Brighter gradient, larger shadow, slight scale
- Active: Pressed state, reduced scale

**Modal Animation:**
- Fade in backdrop (0.2s ease)
- Scale in modal (0.3s ease-out, spring effect)
- Fade out on close (0.2s ease)

### 6.3 Edge Cases

**Case 1: Reactivate During Reading**
- If user is currently reading another document, reactivation still works
- No interruption to current reading session

**Case 2: Example Reading**
- Example reading can be reactivated like any other reading
- No special handling needed

**Case 3: Multiple Reactivations**
- User can reactivate, complete, and reactivate again infinitely
- No limits on reactivation count

**Case 4: Deleted Reading**
- If user deletes a completed reading, it's permanently gone
- Reactivation not possible after deletion

---

## 7. Success Metrics

### Launch Criteria
- ✅ Reactivate button visible on completed readings
- ✅ Modal opens on button click
- ✅ Confirmation moves reading to Active tab
- ✅ All reading data preserved
- ✅ Keyboard navigation works (Tab, Enter, Esc)
- ✅ Focus trap functional
- ✅ ARIA labels correct
- ✅ Dark mode support
- ✅ Theme compatibility (Detox, High Contrast)

### Post-Launch Metrics

**Adoption:**
- % of users who reactivate at least one reading
- Average reactivations per user per month
- Most frequently reactivated reading types (by tags)

**Behavior:**
- Time between completion and reactivation
- % of reactivated readings that get completed again
- User retention (do reactivators use app more?)

**Target Goals:**
- 15%+ of users try reactivation in first month
- 5%+ of completed readings get reactivated
- 80%+ of reactivated readings completed again (indicating genuine re-reading intent)

---

## 8. Implementation Summary

### Phase 1: Core Functionality (Completed ✔️)
- ✅ Create ConfirmReactivateModal component
- ✅ Add reactivate button to ReadingCard
- ✅ Implement reactivation logic in page.tsx
- ✅ Test on all themes (Light, Dark, Detox, High Contrast)

### Phase 2: Polish (Completed ✔️)
- ✅ Add keyboard shortcuts
- ✅ Implement focus trap
- ✅ Add ARIA labels
- ✅ Test accessibility with screen readers

### Implementation Time
**Total**: ~3 hours

---

## 9. Testing Checklist

### Functional Tests
- [x] Reactivate button appears on completed readings
- [x] Button hidden on active readings
- [x] Modal opens on button click
- [x] Confirmation moves reading to Active tab
- [x] Reading data intact after reactivation
- [x] Modal closes on Cancel
- [x] Modal closes on backdrop click
- [x] Multiple reactivations work

### Accessibility Tests
- [x] Keyboard navigation (Tab, Enter, Esc)
- [x] Focus trap active in modal
- [x] Auto-focus on confirm button
- [x] ARIA labels present and correct
- [x] Screen reader announces modal opening
- [x] Button has descriptive aria-label

### Visual Tests
- [x] Button styled correctly (emerald gradient)
- [x] Icon visible and recognizable (refresh/rotate)
- [x] Modal styled consistently with existing modals
- [x] Dark mode support
- [x] Detox theme compatibility
- [x] High Contrast theme compatibility
- [x] Hover states work
- [x] Animations smooth

---

## 10. Future Enhancements

### V2 Features
- [ ] Bulk reactivation (select multiple readings)
- [ ] Reactivation history (track how many times reactivated)
- [ ] Auto-complete prevention (ask before marking as complete again)
- [ ] Reading progress preservation (continue from last position)
- [ ] Statistics: "You've read this 3 times"

### V3 Features
- [ ] Smart reactivation suggestions (based on tags, time since completion)
- [ ] Scheduled reactivation (spaced repetition for learning)
- [ ] Reactivation with notes ("Why am I re-reading this?")

---

## 11. Related Documents

- [PRD-001: Example Document](./PRD-001-example-document.md)
- [PRD-002: Tags System](./PRD-002-tags-system.md)
- [TRD-014: Reading Reactivation Implementation](../trd/TRD-014-reading-reactivation.md)

---

## 12. Appendix

### A. Modal Component Code Structure

```tsx
interface ConfirmReactivateModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmReactivateModal({
  isOpen,
  title,
  onClose,
  onConfirm
}: ConfirmReactivateModalProps) {
  // Focus trap
  // Keyboard handlers (Enter, Esc)
  // Auto-focus on confirm button
  
  return (
    <div className="modal-backdrop">
      <div className="modal-container" role="dialog" aria-modal="true">
        {/* Icon + Title */}
        {/* Message */}
        {/* Buttons: Cancel, Reactivar */}
      </div>
    </div>
  );
}
```

### B. Button Variants Comparison

| Action | Icon | Color Gradient | Use Case |
|--------|------|----------------|----------|
| **Reactivate** | 🔄 Refresh | Emerald → Teal | Move to Active |
| **Edit** | ✏️ Pencil | Blue → Purple | Change title/tags |
| **Delete** | 🗑️ Trash | Red → Rose | Permanent removal |

All three buttons maintain visual consistency with gradient backgrounds and matching shadow effects.

---

**End of PRD-014**
