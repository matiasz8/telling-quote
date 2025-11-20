# PRD-001: Example Document on First Load

**Status**: 📝 Draft  
**Priority**: High  
**Owner**: TBD  
**Created**: November 20, 2025  
**Last Updated**: November 20, 2025

---

## Overview

Provide new users with an example reading document that demonstrates all markdown features when they first open the application with no saved readings.

---

## Problem Statement

Currently, when users open tellingQuote for the first time, they see an empty dashboard. This creates friction because:

1. Users don't understand what the app does
2. Users don't see examples of supported markdown features
3. There's no guided onboarding experience
4. Users must create content before seeing the reader in action

---

## Goals & Objectives

### Primary Goals

- Reduce time-to-value for new users
- Demonstrate all markdown capabilities
- Provide interactive learning experience

### Success Metrics

- 80%+ of new users view the example document
- 50%+ of new users create their own reading after viewing example
- Reduced support questions about "what markdown is supported"

---

## User Stories

**As a new user**  
I want to see an example reading when I first open the app  
So that I can understand what the app does and what features are available

**As a returning user**  
I want the example to disappear once I create my own readings  
So that my dashboard isn't cluttered

**As a user exploring features**  
I want the example to showcase all markdown types  
So that I can learn what's possible

---

## Requirements

### Functional Requirements

#### FR-1: Auto-create Example Document

- **Description**: When localStorage is empty (first visit), automatically create an example reading
- **Trigger**: Application detects `readings` array is empty or undefined
- **Behavior**: Create a reading with:
  - Title: "Welcome to tellingQuote - Example Reading"
  - Content: Comprehensive markdown showcasing all features
  - ID: Special ID (e.g., `example-reading-v1`)

#### FR-2: Example Content

Must demonstrate:

- ✅ Headings (## Subtitle)
- ✅ Bold, italic, strikethrough
- ✅ Inline code
- ✅ Code blocks with different languages
- ✅ Bullet lists (nested)
- ✅ Numbered lists (nested)
- ✅ Blockquotes
- ✅ Links
- ✅ Images (use placeholder service like placeholder.com)
- ✅ Highlighting (==text==)
- ✅ Tables
- ✅ Task lists [ ] [x]
- ✅ Footnotes [^1]
- ✅ Math equations (inline and block)

#### FR-3: Dismissible Example

- User can delete the example like any other reading
- Example does NOT reappear after deletion
- Track in localStorage: `exampleDismissed: true`

#### FR-4: Example Badge (Optional Enhancement)

- Show visual indicator that this is an example
- Badge/tag: "Example" or "Tutorial"
- Different styling from user-created readings

### Non-Functional Requirements

#### NFR-1: Performance

- Example creation should not delay app startup
- Content should be stored as constant, not fetched

#### NFR-2: Internationalization Ready

- Example content should be extractable for i18n
- Use English for v1

#### NFR-3: Maintainability

- Example content should be in separate file (`EXAMPLE_MARKDOWN.md`)
- Easy to update without code changes

---

## Design Considerations

### Content Structure

```typescript
// lib/constants/exampleContent.ts
export const EXAMPLE_READING: Reading = {
  id: 'example-reading-v1',
  title: 'Welcome to tellingQuote - Interactive Tutorial',
  content: EXAMPLE_MARKDOWN, // imported from file
}
```

### User Flow

```bash
User opens app
    ↓
Check localStorage.readings
    ↓
Empty? → Create example reading
    ↓
Dashboard shows example with badge
    ↓
User clicks to view
    ↓
Navigates through slides
    ↓
Returns to dashboard
    ↓
User can delete or keep example
```

---

## Out of Scope

- ❌ Multiple example documents
- ❌ Interactive tutorial overlay/tooltips
- ❌ Video walkthrough
- ❌ Multi-language examples (v1)
- ❌ Editable example (user can delete, but not edit)

---

## Open Questions

1. **Should the example auto-delete after X days?**
   - Proposal: No, let user delete manually

2. **Should example reading count towards "Active" tab?**
   - Proposal: Yes, treat it like normal reading

3. **Should we track analytics on example usage?**
   - Proposal: Track in localStorage only (privacy-first)

4. **Should example be marked as "completed" by default?**
   - Proposal: No, start as pending/active

---

## Success Criteria

### MVP (Minimum Viable Product)

- ✅ Example auto-creates on first load
- ✅ Demonstrates all Phase 1-4 markdown features
- ✅ User can delete example
- ✅ Example doesn't reappear after deletion

### Future Enhancements

- Multi-language examples
- Interactive tutorial mode
- Multiple example templates by use case (study notes, documentation, etc.)

---

## Dependencies

- Existing markdown processing (`textProcessor.ts`)
- localStorage system (`useLocalStorage` hook)
- EXAMPLE_MARKDOWN.md file (already exists in repo)

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Example content becomes outdated | Medium | Version the example ID, auto-update on new versions |
| Takes too long to create on startup | Low | Content is static, creation is instant |
| Users confused by auto-created content | Medium | Clear badge/indicator that it's an example |

---

## Timeline Estimate

- **Design**: 0.5 days
- **Development**: 1 day
- **Testing**: 0.5 days
- **Total**: 2 days

---

## Related Documents

- [TRD-001: Example Document Implementation](../trd/TRD-001-example-document.md)
- [EXAMPLE_MARKDOWN.md](../../EXAMPLE_MARKDOWN.md)
- [Architecture Overview](../Architecture-Overview.md)
