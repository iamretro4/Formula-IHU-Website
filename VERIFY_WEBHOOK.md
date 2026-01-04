# How to Verify Your Webhook Endpoint

## Quick Test Methods

### Method 1: Browser Test (Easiest)

1. Open your browser
2. Go to: `https://formula-ihu-website.vercel.app/api/webhooks/resend`
3. You should see a JSON response like:
   ```json
   {
     "message": "Resend webhook endpoint is active",
     "endpoint": "/api/webhooks/resend",
     "supportedEvents": ["email.received"]
   }
   ```

### Method 2: PowerShell Script

Run the test script:
```powershell
.\test-webhook.ps1
```

This will test:
- ✅ GET request (endpoint info)
- ✅ POST request (simulate webhook)
- ✅ Endpoint accessibility

### Method 3: Manual curl Test

**Test GET request:**
```bash
curl https://formula-ihu-website.vercel.app/api/webhooks/resend
```

**Test POST request:**
```bash
curl -X POST https://formula-ihu-website.vercel.app/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.received",
    "data": {
      "email_id": "test-123",
      "from": "test@example.com",
      "to": ["info@fihu.gr"],
      "subject": "Test"
    }
  }'
```

### Method 4: Online Tools

Use online tools like:
- **Postman**: https://www.postman.com
- **HTTPie**: https://httpie.io
- **Webhook.site**: https://webhook.site (for testing)

## Expected Responses

### ✅ Success (GET Request)
```json
{
  "message": "Resend webhook endpoint is active",
  "endpoint": "/api/webhooks/resend",
  "supportedEvents": ["email.received"]
}
```

### ✅ Success (POST Request)
```json
{
  "success": true,
  "message": "Email received and processed",
  "emailId": "test-123",
  "recipient": "info@fihu.gr"
}
```

### ❌ Common Errors

**404 Not Found:**
- Site not deployed yet
- Endpoint doesn't exist
- Wrong URL

**500 Internal Server Error:**
- Check deployment logs
- Check environment variables

**401 Unauthorized:**
- Webhook verification enabled but secret missing
- This is OK - means endpoint is working but needs valid signature

## Before Testing

Make sure:
1. ✅ Site is deployed to Vercel
2. ✅ The endpoint file exists: `app/api/webhooks/resend/route.ts`
3. ✅ You've pushed the latest code to your repository
4. ✅ Vercel has finished building and deploying

## Deploy Checklist

If you get 404, make sure you've:

1. **Committed the webhook file:**
   ```bash
   git add app/api/webhooks/resend/route.ts
   git commit -m "Add Resend webhook endpoint"
   git push
   ```

2. **Deployed to Vercel:**
   - Push to your main branch (Vercel auto-deploys)
   - Or manually trigger deployment in Vercel dashboard

3. **Wait for deployment:**
   - Check Vercel dashboard for build status
   - Wait for "Ready" status

4. **Test again:**
   - Run `.\test-webhook.ps1`
   - Or visit the URL in browser

## Troubleshooting

### Endpoint returns 404

1. Check if site is deployed:
   - Visit: `https://formula-ihu-website.vercel.app`
   - If main site works, endpoint should work too

2. Check if file exists:
   - Verify: `app/api/webhooks/resend/route.ts` exists
   - Check it's committed to git

3. Check Vercel build logs:
   - Go to Vercel dashboard → Your project → Deployments
   - Check for build errors

### Endpoint returns 500

1. Check environment variables:
   - `RESEND_API_KEY` should be set in Vercel
   - `RESEND_WEBHOOK_SECRET` (optional but recommended)

2. Check server logs:
   - Vercel dashboard → Functions → Logs
   - Look for error messages

### Endpoint works but webhook doesn't receive events

1. Check webhook is active in Resend
2. Check webhook URL is correct
3. Check webhook secret matches
4. Send a test email to `info@fihu.gr`
5. Check Resend webhook logs for delivery status

