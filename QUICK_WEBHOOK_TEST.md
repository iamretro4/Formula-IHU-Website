# Quick Webhook Test

## ✅ Deployment Status

The webhook endpoint has been:
- ✅ Created: `app/api/webhooks/resend/route.ts`
- ✅ Committed to git
- ✅ Pushed to GitHub
- ⏳ Deploying to Vercel (wait 1-2 minutes)

## Test Methods

### Method 1: Browser (Easiest)
1. Wait 1-2 minutes for Vercel to finish deploying
2. Visit: https://formula-ihu-website.vercel.app/api/webhooks/resend
3. You should see:
   ```json
   {
     "message": "Resend webhook endpoint is active",
     "endpoint": "/api/webhooks/resend",
     "supportedEvents": ["email.received"]
   }
   ```

### Method 2: PowerShell Script
```powershell
.\test-webhook.ps1
```

### Method 3: Quick PowerShell Command
```powershell
Invoke-RestMethod -Uri "https://formula-ihu-website.vercel.app/api/webhooks/resend"
```

### Method 4: curl (if you have it)
```bash
curl https://formula-ihu-website.vercel.app/api/webhooks/resend
```

## Expected Response

If working correctly, you'll see:
```json
{
  "message": "Resend webhook endpoint is active",
  "endpoint": "/api/webhooks/resend",
  "supportedEvents": ["email.received"]
}
```

## If You Get 404

1. **Wait longer** - Vercel might still be deploying (check Vercel dashboard)
2. **Check Vercel deployment** - Go to your Vercel dashboard and check if deployment succeeded
3. **Verify URL** - Make sure you're using the correct URL

## Once It Works

After the endpoint is accessible:
1. ✅ Add the webhook in Resend dashboard
2. ✅ Use URL: `https://formula-ihu-website.vercel.app/api/webhooks/resend`
3. ✅ Select event: `email.received`
4. ✅ Copy the webhook secret
5. ✅ Add to `.env.local`: `RESEND_WEBHOOK_SECRET=whsec_...`

## Check Vercel Deployment

You can check deployment status at:
- Vercel Dashboard → Your Project → Deployments
- Look for the latest deployment with commit "Add Resend webhook endpoint"

