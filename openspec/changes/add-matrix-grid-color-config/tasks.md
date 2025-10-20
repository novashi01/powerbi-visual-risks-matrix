## Tasks

### 1. Spec
- [ ] Draft `openspec/changes/add-matrix-grid-color-config/specs/matrix-grid/spec.md` with ADDED/MODIFIED requirements and scenarios

### 2. Implementation
- [ ] Update `src/settings.ts` to add transparency and grid border color settings; remove `dataColors` entry
- [ ] Update `src/visual.ts` to apply configured alpha to severity fills and use grid border color
- [ ] Ensure category data behavior is documented and add a short note in `DOCUMENTATION-INDEX.md` if needed

### 3. Validation
- [ ] Run visual unit tests and linters
- [ ] Validate OpenSpec change with `openspec validate add-matrix-grid-color-config --strict`
