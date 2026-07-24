# Contributing to tellingQuote

Welcome! This guide explains how to contribute features, bug fixes, and improvements to tellingQuote.

## Quick Start

1. **For features**: Start with PRD (Product Requirements Document) in `docs/prd/`
2. **For bug fixes**: Open a GitHub issue and reference the problem
3. **For anything else**: Check [Discussions](https://github.com/matiasz8/telling-quote/discussions)

---

## Development Setup

### Prerequisites

- Node.js 20+
- npm 10+
- Git

### Local Setup

```bash
# Clone repository
git clone git@github.com:matiasz8/telling-quote.git
cd telling-quote

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in browser
```

### Validation Before Push

```bash
# Type checking + linting
npm run validate

# Documentation contracts + feature traceability
npm run validate:docs

# Build check
npm run build

# Fix issues automatically
npm run lint:fix
```

---

## Workflow: Feature Development

### Phase 1: Planning (PRD)

1. **Check existing PRDs**: Browse `docs/prd/README.md`
2. **Draft new PRD**: Copy `docs/prd/TEMPLATE.md` (if needed)
   ```bash
   cp docs/prd/TEMPLATE.md docs/prd/PRD-NNN-your-feature.md
   ```
3. **Fill PRD sections**:
   - Problem Statement
   - Goals & Objectives
   - User Stories (≥3)
   - Functional Requirements (FR-1, FR-2, etc.)
   - Non-Functional Requirements (NFR-1, NFR-2, etc.)
   - Success Metrics (quantifiable)
   - Out of Scope

4. **Get feedback**: Open a draft PR or Discussion

5. **Use Planning Agent**:
   ```
   @copilot: Plan PRD-NNN for implementation
   ```
   This will output:
   - Completeness checklist
   - Task breakdown
   - Effort estimate
   - Go/No-Go recommendation

6. **Get approval**: Product + Technical lead must approve

### Phase 2: Technical Design (TRD)

1. **Create TRD**: Copy `docs/trd/TEMPLATE.md`
   ```bash
   cp docs/trd/TEMPLATE.md docs/trd/TRD-NNN-your-feature.md
   ```
   Number must match PRD (TRD-002 implements PRD-002)

2. **Fill TRD sections**:
   - Technical Architecture (diagrams encouraged)
   - Data Models (TypeScript interfaces)
   - Component Changes (which files affected)
   - Implementation Plan (step-by-step)
   - Testing Strategy (unit, integration, E2E)
   - Deployment Plan
   - Rollback Plan
   - Performance Considerations
   - Security Considerations

3. **Reference FEATURE_INDEX.json**: Check `FEATURE_INDEX.json` for:
   - affected_files list (are they complete?)
   - dependencies (is PRD-XXX ready?)
   - risks (what could go wrong?)

4. **Get approval**: Technical lead must review

### Phase 3: Implementation

1. **Create feature branch**:
   ```bash
   git checkout -b feat/PRD-NNN-your-feature
   ```
   Convention: `feat/PRD-NNN-kebab-name`

2. **Implement according to TRD**:
   - Follow TRD Implementation Plan step-by-step
   - Reference FEATURE_INDEX.json affected_files
   - Write tests as you go (unit + hotspot regression tests)

3. **Update types if needed**:
   ```bash
   # All type changes go to types/index.ts
   # Make sure TypeScript strict mode still passes
   npm run type-check
   ```

4. **Run tests locally**:
   ```bash
   # When test infrastructure is ready:
   npm run test  # unit + integration
   npm run test:e2e  # end-to-end
   ```

5. **Check hotspots** (if your changes touch these):
   - **Dashboard** (`app/page.tsx`): Test migration modal, sign-in flow
   - **Sync** (`hooks/useReadingSync.ts`): Test cloud/local merge with Firebase Emulator
   - **TTS** (`hooks/useTTS.ts`): Test voice loading and playback
   - **Settings** (`components/SettingsModal.tsx`): Test theme/font/a11y application

6. **Validate before pushing**:
   ```bash
   npm run validate  # lint + type-check
   npm run build     # full build
   ```

### Phase 4: Code Review (PR)

1. **Create PR** from feature branch to `main`

2. **Fill PR template**:
   - [ ] Link to PRD/TRD
   - [ ] Map requirements to code (FR-1: file.tsx line X)
   - [ ] Check off verification checklist
   - [ ] List hotspots tested

3. **Use Delivery Agent** to generate implementation report:
   ```
   @copilot: Generate Delivery Report for PRD-NNN / TRD-NNN
   ```
   Include this in PR description

4. **Use Review Agent** for automated validation:
   ```
   @copilot: Review PR for PRD-NNN / TRD-NNN
   ```

5. **Run docs contracts gate locally before requesting final review**:
   ```bash
   npm run validate:docs
   ```

6. **Address feedback**:
   - Reviewer will check traceability, risks, tests
   - Respond to all comments
   - Re-request review when ready

7. **Merge**: Once approved, merge to `main`

### Phase 5: Post-Merge

1. **Update FEATURE_INDEX.json**: Status → "completed"
2. **Update docs/prd/README.md**: Status → ✔️ Completed
3. **Update docs/trd/README.md**: Status → ✔️ Completed
4. **Update CHANGELOG.md**: Add entry describing feature

---

## Workflow: Bug Fixes

### For Small Bugs (Typo, UI tweak, etc.)

1. Create branch: `fix/short-description`
2. Commit: `git commit -m "Fix: description"`
3. Open PR with explanation
4. No PRD/TRD needed (but reference the issue)

### For Complex Bugs (Data loss, auth failure, etc.)

1. Create issue with reproduction steps
2. Assign priority: Critical/High/Medium/Low
3. If touching hotspots (sync, TTS, settings), run extra validation:
   ```bash
   npm run test  # full suite (when available)
   ```
4. Link PR to issue: "Fixes #123"

---

## Commit Guidelines

### Message Format

```
type: description

- Bullet point 1
- Bullet point 2
```

### Types

- `feat:` New feature (PRD-XXX related)
- `fix:` Bug fix
- `refactor:` Code restructuring (no behavior change)
- `perf:` Performance improvement
- `test:` Test additions/updates
- `docs:` Documentation updates
- `chore:` Dependency updates, config changes

### Examples

```bash
git commit -m "feat: add tag filtering to dashboard (PRD-006)"
git commit -m "fix: prevent sync race condition in migration modal"
git commit -m "docs: update FEATURE_INDEX.json for completed features"
git commit -m "test: add Firebase Emulator tests for auth flow"
```

---

## Testing Strategy

### Unit Tests (When Available)

```bash
npm run test
```

Test utilities, hooks, and pure functions:
- `lib/utils/tagHelpers.ts`
- `lib/utils/markdownFormatter.ts`
- `hooks/useLocalStorage.ts`

### Integration Tests (When Available)

```bash
npm run test:integration
```

Test Firebase Emulator + actual Firestore rules:

```bash
npm run test:firestore:rules  # Requires Firebase CLI
```

### E2E Tests (When Available)

```bash
npm run test:e2e
```

Test full user flows with Playwright:
- Create reading → Complete → Reactivate
- Sign in → Migrate readings → Sync to device
- Change theme → Verify CSS applies

### Manual Hotspot Testing

Until full test infrastructure is ready, manually verify:

1. **Dashboard Migration**:
   - Sign in first time with existing localStorage readings
   - Confirm migration modal appears
   - Choose "Migrate" → readings sync to Firestore
   - Refresh page → readings still there

2. **Cloud Sync**:
   - Create reading while signed in
   - Check Firestore console (or emulator)
   - Sign out → sign in on different device
   - Verify reading synced

3. **TTS Playback**:
   - Open any reading
   - Enable TTS in settings
   - Play audio → speaker works
   - Check voice selection doesn't hang

4. **Settings Application**:
   - Change font family → text updates immediately
   - Change font size → text updates immediately
   - Change theme → all components rerender
   - Refresh page → settings persist

---

## Code Style

### TypeScript

- Use strict mode (already enabled in `tsconfig.json`)
- Prefer explicit types over `any`
- Use `const` by default, `let` if reassignment needed
- Avoid `var`

### React Components

- Use functional components + hooks
- Props as destructured object with type annotation
- File naming: `ComponentName.tsx` (PascalCase)
- Folder naming: `folder-name/` (kebab-case)

### Tailwind CSS

- Use Tailwind utility classes (no custom CSS unless necessary)
- Responsive: `sm:`, `md:`, `lg:`, `xl:` prefixes
- Dark mode: `dark:` prefix (already supported)
- No inline styles

### Comments

- JSDoc for exported functions/components
- Explain **why**, not **what** (code shows what it does)
- Link to related PRD/TRD sections for complex logic

Example:

```typescript
/**
 * Normalize tags by trimming, lowercasing, and removing duplicates.
 * Per TRD-002 FR-1 validation requirements: 1-20 chars, max 5 tags per reading.
 *
 * @param tags - Comma or space-separated string
 * @returns Array of normalized tag strings
 * @throws Error if tag count > 5 or any tag > 20 chars
 */
export function normalizeTags(tags: string): string[] {
  // Implementation...
}
```

---

## CI/CD Pipeline

### What Runs on Every PR

1. **ESLint** — Code style & best practices
2. **TypeScript** — Type checking (strict mode)
3. **Build Check** — Full Next.js build
4. **Markdown Lint** — Doc formatting (warnings only)

### When Available (Phase 2+)

5. **Unit Tests** — `npm run test`
6. **Firebase Emulator Tests** — `npm run test:firestore:rules`
7. **E2E Tests** — `npm run test:e2e` (Playwright)
8. **Accessibility Audit** — `npm run audit:a11y` (axe-core)

**All must pass before merge** (except Markdown, which is advisory).

---

## PR Template Checklist

When you open a PR, fill out `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
- [ ] Related PRD: PRD-002
- [ ] Related TRD: TRD-002
- [ ] FR-1 implemented in: components/ReadingCard.tsx (lines 45-80)
- [ ] FR-2 implemented in: app/page.tsx (lines 200-250)
- [ ] All hotspots tested: Dashboard ✓, Sync ✓, TTS N/A, Settings ✓
```

This ensures traceability from requirement → code.

---

## FEATURE_INDEX.json: Your Reference

Before implementing, check `FEATURE_INDEX.json`:

```json
{
  "id": "PRD-002",
  "name": "Tags System",
  "affected_files": [
    "types/index.ts",
    "components/ReadingCard.tsx",
    "components/NewReadingModal.tsx"
  ],
  "risks": [
    "No filtering UI yet (v2 feature)",
    "Migration needed for existing data"
  ],
  "dependencies": []
}
```

This tells you:
- What files you'll likely touch
- What risks to watch for
- What other features you depend on

---

## Getting Help

### Documentation

- **Architecture**: [docs/Architecture-Overview.md](docs/Architecture-Overview.md)
- **PRD/TRD Guide**: [docs/HOW-TO-PRD-TRD.md](docs/HOW-TO-PRD-TRD.md)
- **Agent Contracts**: [docs/AGENTS.md](docs/AGENTS.md) (how agents validate your work)

### People

- Questions about feature design → Open a Discussion
- Questions about implementation → Open an issue or comment in PR
- Questions about process → Check [docs/AGENTS.md](docs/AGENTS.md) or reach out

### Agents

- **Plan my feature**: `@copilot: Plan PRD-XXX for implementation`
- **Review my code**: `@copilot: Generate Delivery Report for PRD-XXX / TRD-XXX`
- **Check my PR**: `@copilot: Review PR for PRD-XXX / TRD-XXX`

---

## Code of Conduct

Please be respectful, inclusive, and collaborative. This is a learning project; we're here to help each other improve.

---

## License

MIT (see [LICENSE](LICENSE))

---

**Last Updated**: 2026-04-17  
**Maintained By**: Development Team
