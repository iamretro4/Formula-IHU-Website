# Resend Webhook Setup - Step by Step Guide

## Quick Setup Steps

### Step 1: Determine Your Webhook URL

Your webhook URL will be:
```
https://YOUR_DOMAIN/api/webhooks/resend
```

**Replace `YOUR_DOMAIN` with one of the following:**
- If you have a custom domain: `https://fihu.gr/api/webhooks/resend`
- If deployed on Vercel: `https://your-project.vercel.app/api/webhooks/resend`
- For local testing: Use ngrok (see below)

### Step 2: Add Webhook in Resend Dashboard

1. **Go to Resend Webhooks**
   - Visit: https://resend.com/webhooks
   - Or navigate: Dashboard → Webhooks

2. **Click "Add Webhook"**

3. **Fill in the webhook details:**
   - **URL**: Enter your webhook URL from Step 1
     - Example: `https://fihu.gr/api/webhooks/resend`
   - **Event Type**: Select `email.received`
   - **Description** (optional): "Receive emails for info@fihu.gr and technical@fihu.gr"

4. **Click "Add"**

5. **Copy the Webhook Secret**
   - After creating the webhook, Resend will show you a webhook secret
   - It will look like: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **IMPORTANT**: Copy this secret immediately - you won't be able to see it again!

### Step 3: Add Webhook Secret to Environment Variables

Add the webhook secret to your `.env.local` file:

```bash
# Add this line to your .env.local file
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Replace `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your actual webhook secret from Step 2.**

### Step 4: Test the Webhook

1. **Test the endpoint** (optional):
   - Visit: `https://YOUR_DOMAIN/api/webhooks/resend` in your browser
   - You should see: `{"message":"Resend webhook endpoint is active",...}`

2. **Send a test email**:
   - Send an email to `info@fihu.gr` or `technical@fihu.gr`
   - Check your application logs to see the webhook event

3. **Check Resend Dashboard**:
   - Go to Webhooks → Your webhook
   - Check "Recent Events" to see if the webhook was called successfully

## Local Testing (Optional)

If you want to test locally before deploying:

1. **Install ngrok** (if not already installed):
   ```bash
   npm install -g ngrok
   # Or download from https://ngrok.com
   ```

2. **Start your dev server**:
   ```bash
   npm run dev
   ```

3. **Start ngrok** (in a new terminal):
   ```bash
   ngrok http 3333
   ```

4. **Use the ngrok URL**:
   - Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
   - Your webhook URL will be: `https://abc123.ngrok.io/api/webhooks/resend`
   - Use this URL in Resend webhook configuration

## Troubleshooting

### Webhook not receiving events?

1. **Check webhook URL is correct**
   - Must be HTTPS (not HTTP)
   - Must be publicly accessible
   - Must end with `/api/webhooks/resend`

2. **Check webhook is enabled**
   - Go to Resend → Webhooks
   - Make sure your webhook shows as "Active"

3. **Check application logs**
   - Look for webhook events in your server logs
   - Check for any error messages

4. **Test the endpoint**
   - Visit the webhook URL in browser
   - Should return JSON response

### Webhook verification failing?

1. **Check RESEND_WEBHOOK_SECRET is set**
   - Make sure it's in your `.env.local` file
   - Make sure it matches the secret from Resend dashboard
   - Restart your dev server after adding the secret

2. **Check secret format**
   - Should start with `whsec_`
   - Should be a long string

## Next Steps

After setting up the webhook, you can customize the email handling in:
- `app/api/webhooks/resend/route.ts`

You can add logic to:
- Save emails to a database
- Forward emails to team members
- Auto-reply to emails
- Process attachments
- Route emails based on subject or content

## Need Help?

If you encounter any issues:
1. Check the Resend webhook logs in the dashboard
2. Check your application logs for errors
3. Verify all environment variables are set correctly
4. Make sure your domain is verified in Resend

