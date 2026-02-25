@echo off
echo ============================================
echo  Stellar Pay dApp - GitHub Push Script
echo ============================================
echo.

cd /d "c:\Users\khush\OneDrive\Desktop\RIPAy"

echo [1/5] Initializing Git repository...
git init

echo.
echo [2/5] Adding all project files...
git add .

echo.
echo [3/5] Creating initial commit...
git commit -m "feat: Stellar Pay dApp - XLM payment app on Testnet"

echo.
echo [4/5] Setting remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/nagarekhushi04/white-belt-level-1.git

echo.
echo [5/5] Pushing to GitHub (main branch)...
git branch -M main
git push -u origin main

echo.
echo ============================================
echo  Done! Check: https://github.com/nagarekhushi04/white-belt-level-1
echo ============================================
pause
