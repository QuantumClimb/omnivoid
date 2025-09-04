@echo off
echo Adding all files to git...
git add .

echo Committing changes with message "Update:"...
git commit -m "Update:"

echo Pushing to remote repository...
git push

echo Git upload completed!
pause
