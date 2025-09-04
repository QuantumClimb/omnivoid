@echo off
echo ========================================
echo OMNIVOID LABS - Git Upload Script
echo ========================================
echo.

echo [1/4] Checking git status...
git status
echo.

echo [2/4] Adding all files to git...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files to git
    pause
    exit /b 1
)
echo ✓ Files added successfully
echo.

echo [3/4] Committing changes with message "Update:"...
git commit -m "Update:"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes
    echo This might be because there are no changes to commit
    pause
    exit /b 1
)
echo ✓ Changes committed successfully
echo.

echo [4/4] Pushing to remote repository...
git push
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to remote repository
    echo Check your internet connection and git credentials
    pause
    exit /b 1
)
echo ✓ Changes pushed successfully
echo.

echo ========================================
echo Git upload completed successfully!
echo ========================================
pause
