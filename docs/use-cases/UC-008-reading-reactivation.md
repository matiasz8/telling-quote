# UC-008: Reading Reactivation - Undo Accidental Completion

**Related PRD/TRD**: [PRD-014](../prd/PRD-014-reading-reactivation.md)

**Actors**: All users

---

## Preconditions

- User has just completed a reading (it moved to "Completed" tab)
- User realizes they want to resume or made a mistake marking it complete
- Completion happened within current session or recently (timestamp tracked)

## Main Flow

1. User navigates to "Completed" tab on dashboard
2. User sees reading they accidentally marked complete
3. User clicks the reactivate icon (redo/refresh icon) on completed reading card
4. System displays ConfirmReactivateModal asking "Move reading back to Active?"
5. User clicks "Confirm"
6. System moves reading from Completed back to Active tab
7. System resets completion status in Firestore/localStorage
8. System updates reading's localStorage flag: `completed = false`
9. Completed reading card disappears from Completed tab
10. Reading reappears in Active tab in its original position
11. User can resume reading from where they left off

## Postcondition

- Reading is marked as Active again
- Completion state is fully reversed
- User can continue from their last slide position
- Change persists across sessions (if authenticated)

## Related Features

- Firebase Auth: Reactivation state syncs across devices
- Tags: Reactivated reading retains all tags and metadata

---

← [Back to Use Cases Index](README.md)
