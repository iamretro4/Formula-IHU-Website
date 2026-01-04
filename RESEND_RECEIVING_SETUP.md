# Resend Email Receiving Setup Guide

This guide explains how to set up receiving emails at `info@fihu.gr` and `technical@fihu.gr` using Resend.

## Overview

Resend supports receiving emails (inbound emails) via webhooks. When someone sends an email to your configured addresses, Resend processes it and sends a webhook event to your application.

## Prerequisites

1. A Resend account with API access
2. Domain access to `fihu.gr` DNS settings
3. Your Next.js application deployed (or accessible via ngrok for local testing)

## Step 1: Add and Verify Your Custom Domain

1. **Log in to Resend Dashboard**
   - Go to https://resend.com
   - Navigate to **Domains** section

2. **Add Your Domain**
   - Click **Add Domain**
   - Enter `fihu.gr`
   - Follow the instructions to add DNS records:
     - **TXT records** for domain verification and DKIM
     - **MX record** for receiving emails (points to Resend's mail servers)

3. **Verify Domain**
   - After adding DNS records, wait for DNS propagation (can take a few minutes to 48 hours)
   - Return to Resend and click **Verify**
   - Once verified, you can receive emails at any address on your domain

## Step 2: Configure Webhook

1. **Get Your Webhook URL**
   - For production: `https://yourdomain.com/api/webhooks/resend`
   - For local testing: Use ngrok or VS Code Port Forwarding to create a public URL

2. **Add Webhook in Resend Dashboard**
   - Go to **Webhooks** page in Resend dashboard
   - Click **Add Webhook**
   - Enter your webhook URL: `https://yourdomain.com/api/webhooks/resend`
   - Select event type: **`email.received`**
   - Click **Add**

3. **Get Webhook Secret (Optional but Recommended)**
   - After creating the webhook, Resend will provide a webhook secret
   - Save this secret to your environment variables as `RESEND_WEBHOOK_SECRET`

## Step 3: Configure Environment Variables

Add the following to your `.env.local` file (or your hosting platform's environment variables):

```bash
# Resend API Key (for sending emails - you already have this)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Resend Webhook Secret (for verifying webhook requests - optional but recommended)
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Step 4: Test Your Setup

1. **Send Test Emails**
   - Send an email to `info@fihu.gr`
   - Send an email to `technical@fihu.gr`

2. **Check Your Application**
   - Check your application logs for webhook events
   - The webhook endpoint will log received emails
   - Verify the emails are being processed correctly

## How It Works

1. **Email Arrives**: Someone sends an email to `info@fihu.gr` or `technical@fihu.gr`
2. **Resend Processes**: Resend receives the email and processes it
3. **Webhook Sent**: Resend sends a `POST` request to your webhook endpoint with email metadata
4. **Your App Handles**: Your application processes the webhook event

## Webhook Event Structure

The webhook will receive events like this:

```json
{
  "type": "email.received",
  "created_at": "2024-02-22T23:41:12.126Z",
  "data": {
    "email_id": "56761188-7520-42d8-8898-ff6fc54ce618",
    "created_at": "2024-02-22T23:41:11.894719+00:00",
    "from": "Sender Name <sender@example.com>",
    "to": ["info@fihu.gr"],
    "bcc": [],
    "cc": [],
    "message_id": "<example+123>",
    "subject": "Email Subject",
    "attachments": [
      {
        "id": "2a0c9ce0-3112-4728-976e-47ddcd16a318",
        "filename": "attachment.pdf",
        "content_type": "application/pdf",
        "content_disposition": "attachment",
        "content_id": null
      }
    ]
  }
}
```

## Important Notes

- **Email Body Not Included**: The webhook only includes metadata (from, to, subject, attachments list). To get the email body or attachments, you need to call the Resend API:
  - Get email content: `GET https://api.resend.com/emails/{email_id}`
  - Get attachment: `GET https://api.resend.com/emails/{email_id}/attachments/{attachment_id}`

- **All Addresses Work**: Once you add MX records, you'll receive emails sent to ANY address at your domain (e.g., `anything@fihu.gr`). You can filter/route based on the `to` field in the webhook event.

- **Webhook Reliability**: Resend stores emails even if your webhook is down. You can retrieve them later using the Resend API or dashboard.

## Customizing Email Handling

The webhook endpoint at `/api/webhooks/resend` currently logs received emails. You can customize it to:

- Save emails to a database
- Forward emails to team members
- Auto-reply to emails
- Process attachments
- Route emails based on subject or content

Edit `app/api/webhooks/resend/route.ts` to add your custom logic.

## Troubleshooting

1. **Emails not being received**
   - Check DNS records are correctly configured
   - Verify domain is verified in Resend dashboard
   - Check webhook URL is accessible and returns 200 status

2. **Webhook not firing**
   - Verify webhook URL is correct and accessible
   - Check webhook is enabled in Resend dashboard
   - Review application logs for errors

3. **Testing locally**
   - Use ngrok: `ngrok http 3333` (or your dev server port)
   - Use the ngrok URL as your webhook URL
   - Example: `https://abc123.ngrok.io/api/webhooks/resend`

## Resources

- [Resend Receiving Emails Documentation](https://resend.com/docs/dashboard/receiving/introduction)
- [Resend Custom Domains](https://resend.com/docs/dashboard/receiving/custom-domains)
- [Resend Webhooks Documentation](https://resend.com/docs/webhooks/introduction)

