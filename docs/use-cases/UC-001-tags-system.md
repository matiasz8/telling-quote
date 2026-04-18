# UC-001: Tags System - Organize Readings by Topic

**Related PRD/TRD**: [PRD-002](../prd/PRD-002-tags-system.md), [TRD-002](../trd/TRD-002-tags-system.md)

**Actors**: Student, Content Creator, Knowledge Worker

---

## Preconditions

- User has created at least one reading
- User is viewing the dashboard (Active or Completed tab)

## Main Flow

1. User locates the reading card for which they want to add tags
2. User clicks the edit icon (pencil) on the reading card
3. System displays the edit modal with title and tags fields
4. User clicks on the tags input field
5. User types a tag (1-20 characters, alphanumeric/hyphens)
6. System validates tag format and uniqueness
7. User presses Enter or clicks add
8. Tag appears as a colored badge on the input field
9. User repeats steps 4-8 for up to 5 total tags per reading
10. User clicks "Save Changes"
11. System persists tags to Firestore (if authenticated) or localStorage
12. System updates reading card UI with tag badges

## Postcondition

- Reading displays tags as colored badges (color determined by tag hash)
- Tags are persisted across browser sessions (localStorage) or across devices (if authenticated)
- User can see tags on both Active and Completed reading cards

## Related Features

- Firebase Auth: Tags sync across devices when authenticated
- Enhanced Tag Filtering (future): Tags enable dashboard filtering by topic

---

## Variants

### Variant: Reusing Existing Tags

1. User types partial tag name (e.g., "java")
2. System shows autocomplete suggestions of existing tags matching the pattern
3. User clicks suggestion to add existing tag
4. System avoids duplicate tags

### Variant: Editing Existing Tags

1. User clicks on reading card already containing tags
2. User clicks edit icon
3. User sees existing tags displayed as badges
4. User can remove tag by clicking X on badge
5. User can add new tags following steps 4-8 above
6. Changes are saved as per step 11-12

---

← [Back to Use Cases Index](README.md)
