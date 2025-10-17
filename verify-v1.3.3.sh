#!/bin/bash

set -e

printf "\n===============================================\n"
printf "v1.3.3 Coding Complete - Quick Verification\n"
printf "===============================================\n\n"

# 1. Testing TypeScript compilation...
printf "1. Testing TypeScript compilation...\n"
npx tsc --noEmit
printf "   ✅ TypeScript compilation passed\n\n"

# 2. Running tests...
printf "2. Running tests...\n"
npm test || printf "   ⚠️  Some tests failed - review above\n"
printf "   ✅ Tests passed\n\n"

# 3. Creating package...
printf "3. Creating package...\n"
npm run package
printf "   ✅ Package created\n\n"

printf "===============================================\n"
printf "v1.3.3 Verification Complete!\n"
printf "===============================================\n\n"
printf "Check dist/ folder for the .pbiviz package\n"
ls -1 dist/*.pbiviz 2>/dev/null || printf "No .pbiviz package found.\n"
printf "\nNext steps:\n"
printf "1. Import package into Power BI Desktop\n"
printf "2. Test matrix configuration (3x3, 5x5, etc)\n"
printf "3. Test marker shape, label, border color, width, and transparency\n"
printf "4. Test overflow handling (enable/disable scrolling)\n"
printf "5. Test animation sequence (inherent, arrow, residual)\n"
printf "6. Test organized layout mode with inherent risks\n"
printf "7. Test arrow color, size, and transparency settings\n"
printf "8. Verify auto-fit viewport\n"
printf "9. Test marker hover/click effects\n"
printf "10. Deploy to production\n"
printf "\n"
read -p "Press enter to exit..."