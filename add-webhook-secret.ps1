# PowerShell script to add Resend webhook secret to .env.local
# Usage: .\add-webhook-secret.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resend Webhook Secret Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    Write-Host "Please create .env.local first or run this script from the project root." -ForegroundColor Yellow
    exit 1
}

Write-Host "Enter your Resend webhook secret (starts with 'whsec_'):" -ForegroundColor Yellow
Write-Host "You can find this in Resend Dashboard → Webhooks → Your Webhook" -ForegroundColor Gray
Write-Host ""
$webhookSecret = Read-Host "Webhook Secret"

# Validate the secret format
if (-not $webhookSecret.StartsWith("whsec_")) {
    Write-Host ""
    Write-Host "⚠️  Warning: Webhook secret should start with 'whsec_'" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Cancelled." -ForegroundColor Red
        exit 0
    }
}

# Read current .env.local
$envContent = Get-Content ".env.local" -Raw

# Check if RESEND_WEBHOOK_SECRET already exists
if ($envContent -match "RESEND_WEBHOOK_SECRET") {
    Write-Host ""
    Write-Host "⚠️  RESEND_WEBHOOK_SECRET already exists in .env.local" -ForegroundColor Yellow
    $replace = Read-Host "Replace existing value? (y/n)"
    
    if ($replace -eq "y" -or $replace -eq "Y") {
        # Replace existing value
        $envContent = $envContent -replace "RESEND_WEBHOOK_SECRET=.*", "RESEND_WEBHOOK_SECRET=$webhookSecret"
        Set-Content ".env.local" -Value $envContent -NoNewline
        Write-Host ""
        Write-Host "✅ Updated RESEND_WEBHOOK_SECRET in .env.local" -ForegroundColor Green
    } else {
        Write-Host "Cancelled. No changes made." -ForegroundColor Yellow
        exit 0
    }
} else {
    # Append new secret
    Add-Content ".env.local" -Value "`n# Resend Webhook Secret (for receiving emails)"
    Add-Content ".env.local" -Value "RESEND_WEBHOOK_SECRET=$webhookSecret"
    Write-Host ""
    Write-Host "✅ Added RESEND_WEBHOOK_SECRET to .env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Restart your dev server if it's running" -ForegroundColor White
Write-Host "2. Test the webhook by sending an email to info@fihu.gr" -ForegroundColor White
Write-Host "3. Check your application logs for webhook events" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

