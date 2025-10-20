Create a Pull Request to merge `feat/interactive-cell-scrolling` into `main`.

Repository: https://github.com/novashi01/powerbi-visual-risks-matrix
Branch: feat/interactive-cell-scrolling -> main

Suggested title:
feat: interactive cell scrolling (wheel)

Suggested body:
Adds per-cell mouse-wheel vertical scrolling for overflowed markers; updates openspec specs and archives change.

Details:
- Files changed: src/visual.ts (scroll simplification), openspec/specs/cell-scrolling/spec.md (new spec), openspec/changes/archive/2025-10-20-add-interactive-cell-scrolling/* (archived proposal)
- Commit: fba65de (openspec: archive add-interactive-cell-scrolling and add cell-scrolling spec)

How to open the PR via the web UI:
1. Visit the repository URL.
2. Click "Compare & pull request" next to the recently pushed branch or go to
   https://github.com/novashi01/powerbi-visual-risks-matrix/compare/main...feat/interactive-cell-scrolling
3. Fill title/body above and create PR.

Or, install GitHub CLI and run:

```bash
gh pr create --base main --head feat/interactive-cell-scrolling --title "feat: interactive cell scrolling (wheel)" --body "Adds per-cell mouse-wheel vertical scrolling for overflowed markers; updates openspec specs and archives change. See openspec/changes/archive/2025-10-20-add-interactive-cell-scrolling for details."
```
