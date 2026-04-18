# Workflow C: Content Creator Publishing Tutorial

**Goal**: Create markdown documentation as interactive slides, share with team

**Features Used**: Tags + Onboarding Tutorial + Settings Customization + Sign In for sharing

**Related Use Cases**: [UC-001 Tags System](UC-001-tags-system.md), [UC-007 Onboarding Tutorial](UC-007-onboarding-tutorial.md), [UC-002 Firebase Auth](UC-002-firebase-authentication.md)

**Related PRDs**: [PRD-002](../prd/PRD-002-tags-system.md), [PRD-010](../prd/PRD-010-onboarding-tutorial.md), [PRD-005](../prd/PRD-005-firebase-auth.md)

---

## Flow

1. Creator opens tellingQuote and starts "New Reading"
2. Pastes markdown for "Git Workflow Tutorial" in content field
3. Adds tags: "Git", "Development", "Tutorial", "Internal" (4 tags)
4. Saves reading
5. Reading appears on dashboard with tag badges
6. Creator opens Settings to set default "Sans-serif" font + "Light" theme for professional look
7. Creator tests reading by clicking through slides (sees code blocks formatted nicely)
8. Creator clicks Share button (generates public URL via Vercel)
9. Creator sends link to team via Slack
10. Team members open link, see interactive tutorial
11. Team members can apply their own Settings customization without affecting creator's version
12. Creator can enable/disable tutorial for team members via Settings
13. Later, creator signs in with Google to save their settings across devices

## Outcome

Technical tutorial becomes interactive learning tool that team can consume at their own pace.

---

← [Back to Use Cases Index](README.md)
