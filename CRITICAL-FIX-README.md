# CRITICAL FIX NEEDED - v1.3.1 Package Release

## Current Status: CORRUPTED FILE
The visual.ts file has been severely corrupted with 94 compilation errors.
Code fragments are outside their proper method context.

## ROOT CAUSE
The manual fix scripts accidentally corrupted the file structure by inserting
code in the wrong locations or with incorrect indentation.

## IMMEDIATE SOLUTION

### Option 1: Run Emergency Restore (RECOMMENDED)
```cmd
node emergency-restore.js
```

This will:
1. Hard reset src/visual.ts to last git commit (clean state)
2. Verify the file compiles
3. Apply ONLY the minimal renderOrganizedLayout parameter fix
4. Test compilation again
5. Run enhanced layout test

### Option 2: Manual Recovery
If Option 1 fails, manually restore:

```cmd
git reset --hard HEAD
```

Then manually apply the single fix:
1. Find the `renderOrganizedLayout` method definition
2. Change parameters from `showInherentInOrganized, organizedArrows`  
   to `showInherent, showArrows`
3. Update the method call to pass these parameter names
4. Update internal usage of the parameters

### Option 3: Use Batch File (Windows)
```cmd
EMERGENCY-FIX.bat
```

This runs the emergency restore with user prompts and backups.

## THE FIX NEEDED

Only ONE change is actually needed for the package to work:

**In `renderOrganizedLayout` method signature (around line 398):**

CHANGE FROM:
```typescript
private renderOrganizedLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherentInOrganized: boolean, organizedArrows: boolean) {
```

CHANGE TO:
```typescript
private renderOrganizedLayout(data: RiskPoint[], toXY: (l: number, c: number) => {x: number, y: number}, cellPadding: number, cw: number, ch: number, sm: ISelectionManager, markerRows: number, markerCols: number, showInherent: boolean, showArrows: boolean) {
```

**And update the method call (around line 388):**

CHANGE FROM:
```typescript
this.renderOrganizedLayout(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherentInOrganized, organizedArrows);
```

CHANGE TO:
```typescript
const showInherent = showInherentInOrganized;
const showArrows = organizedArrows;
this.renderOrganizedLayout(data, toXY, cellPadding, cw, ch, sm, markerRows, markerCols, showInherent, showArrows);
```

**And update internal references (around line 421):**

CHANGE FROM:
```typescript
showInherent: showInherentInOrganized,
showArrows: organizedArrows
```

CHANGE TO:
```typescript
showInherent: showInherent,
showArrows: showArrows
```

## VERIFICATION

After applying the fix, verify:

```cmd
npx tsc --noEmit
```
Should show: NO ERRORS

```cmd
node test-enhanced-layout.js
```
Should show: ALL TESTS PASSED

```cmd
npm run package
```
Should create: dist/myVisualA4138B205DFF4204AB493EF33920159E.1.3.1.0.pbiviz

## WHY THIS HAPPENED

The previous fix scripts tried to be too clever and:
- Used regex replacements that inserted code in wrong places
- Created indentation issues
- Duplicated method declarations
- Left code fragments outside of method scopes

## LESSON LEARNED

For future fixes:
- Make backups before automated fixes
- Test immediately after each change
- Use git reset if things go wrong
- Apply minimal, surgical fixes only
- Avoid complex regex replacements on large files

## CURRENT FILES

- `emergency-restore.js` - Automated fix script (USE THIS)
- `EMERGENCY-FIX.bat` - Interactive Windows batch file
- `src/visual.ts.corrupted.bak` - Backup of corrupted file (created by scripts)
- `src/visual.ts.broken` - Another backup (if exists)

## NEXT STEPS

1. Run `node emergency-restore.js`
2. Wait for completion
3. If successful, run `npm run package`
4. Import the .pbiviz into Power BI Desktop
5. Test the visual with sample data

## SUPPORT

If the emergency restore fails:
1. Check the error message
2. Verify git is working: `git status`
3. Try manual recovery: `git reset --hard HEAD`
4. Then manually apply the single parameter name change
5. Test with: `npx tsc --noEmit`

The fix is simple - it's just parameter naming.  
The automated scripts made it complicated.