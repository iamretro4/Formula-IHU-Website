# GitHub Repository Setup Script
# Run this after creating the repository on GitHub

Write-Host "Setting up GitHub repository..." -ForegroundColor Green

# Add remote (already configured)
git remote add origin https://github.com/iamretro4/Formula-IHU-Website.git 2>$null

# Rename branch to main
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/iamretro4/Formula-IHU-Website" -ForegroundColor Cyan
} else {
    Write-Host "Error: Make sure you've created the repository on GitHub first!" -ForegroundColor Red
    Write-Host "Go to: https://github.com/new" -ForegroundColor Yellow
    Write-Host "Repository name: Formula-IHU-Website" -ForegroundColor Yellow
}

