# PowerShell script to test the Resend webhook endpoint
# Usage: .\test-webhook.ps1

param(
    [string]$Url = "https://formula-ihu-website.vercel.app/api/webhooks/resend"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Resend Webhook Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Webhook URL: $Url" -ForegroundColor Yellow
Write-Host ""

# Test 1: GET Request (should return endpoint info)
Write-Host "Test 1: GET Request" -ForegroundColor Cyan
Write-Host "-------------------" -ForegroundColor Gray
try {
    $getResponse = Invoke-RestMethod -Uri $Url -Method GET -ErrorAction Stop
    Write-Host "✅ GET Request Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor White
    $getResponse | ConvertTo-Json -Depth 5 | Write-Host
    Write-Host ""
} catch {
    Write-Host "❌ GET Request Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 404) {
            Write-Host ""
            Write-Host "⚠️  Endpoint not found. Possible issues:" -ForegroundColor Yellow
            Write-Host "   • The site might not be deployed yet" -ForegroundColor White
            Write-Host "   • The URL might be incorrect" -ForegroundColor White
            Write-Host "   • The endpoint might not exist" -ForegroundColor White
        } elseif ($statusCode -eq 500) {
            Write-Host ""
            Write-Host "⚠️  Server error. Check your deployment logs." -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Test 2: POST Request (simulate webhook event)
Write-Host "Test 2: POST Request (Simulate Webhook)" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray

$testEvent = @{
    type = "email.received"
    created_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    data = @{
        email_id = "test-email-id-123"
        from = "test@example.com"
        to = @("info@fihu.gr")
        subject = "Test Email"
        message_id = "<test@example.com>"
        created_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        attachments = @()
    }
} | ConvertTo-Json -Depth 10

try {
    $postResponse = Invoke-RestMethod -Uri $Url `
        -Method POST `
        -ContentType "application/json" `
        -Body $testEvent `
        -ErrorAction Stop
    
    Write-Host "✅ POST Request Successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor White
    $postResponse | ConvertTo-Json -Depth 5 | Write-Host
    Write-Host ""
} catch {
    Write-Host "❌ POST Request Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        
        if ($statusCode -eq 401) {
            Write-Host ""
            Write-Host "⚠️  Unauthorized. This might be expected if webhook verification is enabled." -ForegroundColor Yellow
            Write-Host "   The endpoint is working, but it requires a valid webhook signature." -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Test 3: Check if endpoint is accessible
Write-Host "Test 3: Endpoint Accessibility" -ForegroundColor Cyan
Write-Host "-----------------------------" -ForegroundColor Gray
try {
    $webRequest = [System.Net.WebRequest]::Create($Url)
    $webRequest.Method = "HEAD"
    $webRequest.Timeout = 5000
    $response = $webRequest.GetResponse()
    $statusCode = [int]$response.StatusCode
    
    Write-Host "✅ Endpoint is accessible!" -ForegroundColor Green
    Write-Host "Status Code: $statusCode" -ForegroundColor White
    Write-Host ""
    
    $response.Close()
} catch {
    Write-Host "❌ Endpoint is not accessible!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all tests passed, your webhook endpoint is ready!" -ForegroundColor Green
Write-Host "You can now add it to Resend." -ForegroundColor Green
Write-Host ""
Write-Host "If tests failed, check:" -ForegroundColor Yellow
Write-Host "  • Is the site deployed to Vercel?" -ForegroundColor White
Write-Host "  • Is the URL correct?" -ForegroundColor White
Write-Host "  • Are there any deployment errors?" -ForegroundColor White
Write-Host ""

