# Project Context

<!-- Project specification for AI assistants and contributors -->

# Project Context

## Purpose
This repository implements a Power BI custom visual: the "Risks Matrix" (risk heatmap) visual. It displays inherent and residual risks on a matrix (Likelihood × Consequence), including support for:

- configurable marker shapes, sizes, borders and labels
- animated transitions and optional arrows (inherent → residual)
- organized (grid) and jittered marker layouts, with optional per-cell clipping/scrolling
- formatting pane configuration via `capabilities.json` and `settings.ts`

The goal is to provide a flexible, well-tested Power BI visual for risk reporting that teams can style and embed into Power BI reports.

## Tech Stack
- TypeScript (strict) — main implementation language under `src/`
- Power BI Custom Visuals SDK / `powerbi-visuals-api` — visual integration
- `powerbi-visuals-utils-formattingmodel` — formatting/settings model
- Jest + ts-jest — unit tests in `src/*.test.ts`
- Node.js / npm — build & scripts are in `package.json`
- pbiviz (powerbi-visuals-tools) — creates `.pbiviz` packages (see `npm run package`)
- Webpack — bundling for production builds
- LESS for styles (`style/visual.less`)

Files of interest:
- `src/visual.ts` — main rendering pipeline and UI logic
- `src/settings.ts` — formatting model exposed to Power BI format pane
- `capabilities.json` — Power BI capabilities & formatting properties
- `pbiviz.json` — visual metadata and packaging configuration
- `package.json`, `package-lock.json` — scripts and dependencies
- Tests: `src/*.test.ts` (e.g., `marker-position.test.ts`, `visual.integration.test.ts`)

## Project Conventions

### Code Style
- Use TypeScript with strict checks. Preserve existing spacing/indentation style.
- Follow existing ESLint configuration (`eslint.config.mjs`). Run `npm run lint` if added.
- Keep DOM/SVG manipulation inside `src/visual.ts` helper functions. Prefer small helper methods (e.g., `renderSingleMarkerToGroup`, `renderOrganizedLayout`).
- Naming conventions: camelCase for variables and methods; PascalCase for class and interface names (e.g., `Visual`, `RiskPoint`).
- Avoid innerHTML for DOM updates; manipulate DOM with `createElementNS`/`appendChild` as the project already does.

### Architecture Patterns
- Single Visual class (Power BI lifecycle): constructor sets up SVG defs/groups; `update()` populates settings, computes layout, and delegates to render functions.
- Separation of concerns:
	- data mapping: `mapData()` converts DataView→internal `RiskPoint[]`
	- layout calculation: `toXY()`, `organizeMarkersInCell()`, and jitter calculations
	- rendering: `renderGrid()`, `renderData()`, `renderSingleMarkerToGroup()`
- Formatting model (`FormattingSettingsService`) keeps format-pane input separate from rendering.

### Testing Strategy
- Unit tests: Jest + ts-jest. Tests live under `src/` and exercise pure logic (layout, mapping, helpers) and DOM-creation behaviors where practical.
- Integration-style tests: use the existing `visual.integration.test.ts` to exercise higher-level flows.
- Test commands:
	- Run all tests: `npm test`
	- Add tests for any new logic and run them locally before committing.
- When adding tests that touch DOM elements, prefer testing attributes/values rather than browser rendering.

### Git Workflow
- Branching: use feature branches off `main` for new work (e.g., `feat/marker-shape`).
- Commit messages: follow Conventional Commits style (examples in repo: `feat:`, `fix:`, `chore:`). Keep messages concise and reference issue/ticket IDs when applicable.
- Releases: bump `package.json` and `pbiviz.json` versions, add a release commit like `release: v1.3.3`, and generate a `.pbiviz` with `npm run package`.

## Domain Context
- Domain: risk management heatmap. Each data row represents a risk with an identifier and likelihood/consequence values for inherent and residual states.
- Core concepts:
	- Cells: matrix of Likelihood (rows) × Consequence (columns)
	- Inherent vs Residual: a risk may have both an inherent (I) and residual (R) cell; arrows optionally show movement from I→R
	- Marker layout: markers may be jittered, centered, or organized into a per-cell grid with optional clipping/scrolling
- The rendering must respect Power BI viewport sizes and formatting pane settings.

## Important Constraints
- This is a Power BI custom visual — packaging and capabilities must conform to Power BI rules:
	- Keep `capabilities.json` aligned with `src/settings.ts` to ensure format pane shows expected cards
	- Ensure `pbiviz.json` version and `package.json` version are coordinated for releases
- Avoid accessing undefined nested settings (use optional chaining or defaults) to prevent runtime exceptions in Power BI.
- Performance: the visual should handle a reasonable number of risks (there's a soft cap in code like maxN in `mapData()`), but very large datasets may be reduced client-side.

## External Dependencies
- powerbi-visuals-api — Power BI visuals types and host integration
- powerbi-visuals-utils-formattingmodel — formatting model utilities
- jest, ts-jest — testing
- powerbi-visuals-tools (pbiviz) — packaging and local validation tools

## Build, Test and Release (quick reference)

- Install deps:
```bash
npm ci
```

- Run tests:
```bash
npm test
```

- Package (create .pbiviz in `dist/`):
```bash
npm run package
```

- Recommended release steps:
	1. Bump versions in `package.json` and `pbiviz.json`.
	2. Update `CHANGELOG.md` / release notes files.
	3. Commit with message `release: vX.Y.Z`.
	4. Run `npm run package` and verify `.pbiviz` in `dist/`.
	5. Tag the commit (e.g., `git tag vX.Y.Z`) and push.

## Developer and contributor notes
- Tests are authoritative — add tests for new layout or rendering logic.
- Keep `capabilities.json` and `src/settings.ts` in sync when adding formatting options.
- When modifying SVG creation code, always set required positional attributes (`cx`/`cy` for circles, `x`/`y` for rects) to avoid invisible elements in Power BI.
- Use `this.selectionManager` to wire selection and ensure selection IDs are attached to rendered elements for cross-filtering.

If you'd like, I can also open a PR with this `openspec/project.md` addition and a short release checklist for v1.3.3.
