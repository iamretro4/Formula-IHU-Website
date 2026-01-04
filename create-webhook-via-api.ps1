# PowerShell script to create Resend webhook via API
# Usage: .\create-webhook-via-api.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Create Resend Webhook via API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local file not found!" -ForegroundColor Red
    exit 1
}

# Read RESEND_API_KEY from .env.local
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match "RESEND_API_KEY=(.+)") {
    $apiKey = $matches[1].Trim()
} else {
    Write-Host "❌ Error: RESEND_API_KEY not found in .env.local" -ForegroundColor Red
    Write-Host "Please add RESEND_API_KEY to your .env.local file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Enter your webhook URL:" -ForegroundColor Yellow
Write-Host "Default: https://formula-ihu-website.vercel.app/api/webhooks/resend" -ForegroundColor Gray
$webhookUrl = Read-Host "Webhook URL (press Enter for default)"

if ([string]::IsNullOrWhiteSpace($webhookUrl)) {
    $webhookUrl = "https://formula-ihu-website.vercel.app/api/webhooks/resend"
}

Write-Host ""
Write-Host "Creating webhook..." -ForegroundColor Yellow

# Create webhook via Resend API
$body = @{
    url = $webhookUrl
    events = @("email.received")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.resend.com/webhooks" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $apiKey"
            "Content-Type" = "application/json"
        } `
        -Body $body

    Write-Host ""
    Write-Host "✅ Webhook created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Webhook ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Webhook URL: $($response.url)" -ForegroundColor Cyan
    
    if ($response.secret) {
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Save this webhook secret!" -ForegroundColor Yellow
        Write-Host "Webhook Secret: $($response.secret)" -ForegroundColor Green
        Write-Host ""
        
        $saveSecret = Read-Host "Add webhook secret to .env.local? (y/n)"
        if ($saveSecret -eq "y" -or $saveSecret -eq "Y") {
            # Check if RESEND_WEBHOOK_SECRET already exists
            if ($envContent -match "RESEND_WEBHOOK_SECRET") {
                $envContent = $envContent -replace "RESEND_WEBHOOK_SECRET=.*", "RESEND_WEBHOOK_SECRET=$($response.secret)"
                Set-Content ".env.local" -Value $envContent -NoNewline
            } else {
                Add-Content ".env.local" -Value "`n# Resend Webhook Secret"
                Add-Content ".env.local" -Value "RESEND_WEBHOOK_SECRET=$($response.secret)"
            }
            Write-Host "✅ Webhook secret added to .env.local" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "⚠️  Don't forget to add this to .env.local:" -ForegroundColor Yellow
            Write-Host "RESEND_WEBHOOK_SECRET=$($response.secret)" -ForegroundColor White
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Webhook Setup Complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "❌ Error creating webhook:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "Details: $($errorDetails.message)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "1. API key is invalid" -ForegroundColor White
    Write-Host "2. Webhook URL is not accessible" -ForegroundColor White
    Write-Host "3. Webhook already exists" -ForegroundColor White
    exit 1
}

