# UC-009: Example Document - First-Time Onboarding Content

**Related PRD/TRD**: [PRD-001](../prd/PRD-001-example-document.md)

**Actors**: First-time users

---

## Preconditions

- User is opening app for the very first time
- No existing readings in localStorage
- User is on dashboard page

## Main Flow

1. System detects empty dashboard (no readings)
2. System automatically creates "Welcome to tellingQuote" example reading
3. Example reading content is a markdown tutorial showing:
   - How to format markdown (headers, bold, italics, lists)
   - How to navigate slides (keyboard, arrows, buttons)
   - How to customize settings (fonts, themes, accessibility)
   - How to create your own reading
4. Example reading appears in dashboard "Active" tab
5. User sees breadcrumb or label: "📚 Example Reading"
6. User can click to open and view the example
7. User reads through example slides which explain the app
8. Example reading explains how to add tags, search settings, etc.
9. User completes example reading (optional, no pressure)
10. User can delete example reading anytime without consequence
11. User now understands app and can create their own readings

## Postcondition

- First-time user has seen functional example of app capabilities
- User understands markdown formatting and navigation
- Example reading can be deleted by user to create fresh start
- New user feels guided rather than confused by empty interface

## Related Features

- Onboarding Tutorial: Complements formal tutorial with hands-on example
- Tags: Example reading includes tags showing how feature works
- Markdown Processing: Showcases all supported markdown syntax

---

← [Back to Use Cases Index](README.md)
