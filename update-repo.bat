@echo off
echo Updating GitHub repository...

git add .
git commit -m "Add admin controls and fix topic persistence

- Added admin functionality: close/open topics, delete topics, mute/ban users
- Fixed topic state persistence after page reload
- Improved admin button visibility with proper text colors
- Added closed topic status display
- Fixed category navigation issues
- Removed loading delays for instant topic restoration"

git push origin main

echo Repository updated successfully!
pause