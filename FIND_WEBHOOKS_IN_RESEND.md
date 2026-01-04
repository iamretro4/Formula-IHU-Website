# How to Find Webhooks in Resend Dashboard

If you don't see a "Webhooks" page, try these locations:

## Option 1: Direct URL
Try going directly to:
- **https://resend.com/webhooks**

## Option 2: Navigation Menu
Look for these sections in the Resend dashboard:

1. **Settings** → **Webhooks**
2. **API** → **Webhooks**
3. **Integrations** → **Webhooks**
4. **Receiving** → **Webhooks** (since this is for receiving emails)

## Option 3: Left Sidebar
Check the left sidebar menu for:
- "Webhooks"
- "API"
- "Settings"
- "Integrations"

## Option 4: Receiving Emails Section
Since you're setting up email receiving, webhooks might be under:
1. Go to **Emails** → **Receiving** tab
2. Look for "Webhooks" or "Configure Webhook" button

## Option 5: API Settings
1. Go to **Settings** or **API Keys**
2. Look for "Webhooks" or "Event Webhooks"

## If You Still Can't Find It

The webhook feature might be:
1. **Only available on certain plans** - Check if your Resend plan includes webhooks
2. **In beta** - You might need to enable it in settings
3. **Under a different name** - Look for "Event Hooks", "Notifications", or "Callbacks"

## Alternative: Use Resend API

If the webhook UI isn't available, you can create webhooks via the Resend API:

```bash
curl -X POST https://api.resend.com/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://formula-ihu-website.vercel.app/api/webhooks/resend",
    "events": ["email.received"]
  }'
```

## Need Help?

1. Check Resend documentation: https://resend.com/docs/webhooks/introduction
2. Contact Resend support if webhooks aren't visible in your dashboard
3. Verify your Resend account has access to webhook features

