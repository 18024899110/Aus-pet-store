@echo off
echo ========================================
echo 正在同步到 GitHub...
echo ========================================

git add -A

if "%~1"=="" (
    git commit -m "Auto sync - %date% %time%"
) else (
    git commit -m "%~1"
)

git push

echo.
echo ========================================
echo ✅ 同步完成！
echo ========================================
pause
