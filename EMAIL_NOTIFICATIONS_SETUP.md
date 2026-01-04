# Email Notifications Setup

This document explains how to configure email notifications for form submissions on the Formula IHU website.

## Overview

When users submit forms (Judge, Scrutineer, Volunteer, Contact, Sponsor applications), you can receive email notifications at specified addresses. The system uses Resend to send these emails.

## Required Configuration

### 1. Set up Resend

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account (100 emails/day free tier)

2. **Get your API Key**
   - Go to https://resend.com/api-keys
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Verify Your Domain (for production)**
   - In Resend dashboard, go to Domains
   - Add and verify your domain (e.g., fihu.gr or ihu.gr)
   - This allows you to send from your own domain

### 2. Configure Environment Variables

Add the following to your `.env.local` file (for local development) or your hosting platform's environment variables (for production):

```bash
# Resend API Key (required)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email address to send from (optional, defaults to 'Formula IHU <noreply@fihu.gr>')
FROM_EMAIL=Formula IHU <noreply@fihu.gr>

# Email addresses to receive notifications (comma-separated)
NOTIFICATION_EMAILS=info.formulaihu@ihu.gr,technical.formulaihu@ihu.gr
```

**Important Notes:**
- Replace `re_xxxxxxxxxxxxx` with your actual Resend API key
- Update `FROM_EMAIL` with your verified domain email
- Add all email addresses where you want to receive notifications, separated by commas
- No spaces around commas in `NOTIFICATION_EMAILS`

### 3. Forms That Send Notifications

The following forms will send email notifications when submitted:

- **Judge Application** (`/apply/judge`)
- **Scrutineer Application** (`/apply/scrutineer`)
- **Volunteer Application** (`/apply/volunteer`)
- **Contact Form** (`/contact`)
- **Sponsor Application** (`/apply/sponsor`)

## Email Content

Each notification email includes:
- Form type (Judge, Scrutineer, Volunteer, Contact, or Sponsor)
- All submitted form data in a formatted table
- Professional styling matching Formula IHU branding

## Testing

### Development Mode

If `RESEND_API_KEY` is not set, the system will:
- Still save form submissions to Supabase
- Log email details to the console instead of sending
- Not fail the form submission

This allows you to test forms without setting up email immediately.

### Production Mode

In production, if `RESEND_API_KEY` is not configured:
- Form submissions will still be saved
- Email notifications will fail silently (logged to console)
- Users will still see success messages

## Troubleshooting

### Emails Not Being Received

1. **Check Resend Dashboard**
   - Go to https://resend.com/emails
   - Check if emails are being sent and their status
   - Look for any error messages

2. **Verify Environment Variables**
   - Ensure `RESEND_API_KEY` is set correctly
   - Check that `NOTIFICATION_EMAILS` contains valid email addresses
   - Verify `FROM_EMAIL` uses a verified domain

3. **Check Server Logs**
   - Look for error messages in your hosting platform's logs
   - Check browser console for client-side errors

4. **Domain Verification**
   - Make sure your sending domain is verified in Resend
   - Check SPF and DKIM records are properly configured

### Common Issues

- **"Email service not configured"**: `RESEND_API_KEY` is missing
- **"No recipient emails configured"**: `NOTIFICATION_EMAILS` is not set
- **Emails going to spam**: Verify your domain and set up SPF/DKIM records
- **Rate limiting**: Free tier allows 100 emails/day; upgrade if needed

## Example Configuration

```bash
# .env.local
RESEND_API_KEY=re_abc123xyz789
FROM_EMAIL=Formula IHU <noreply@fihu.gr>
NOTIFICATION_EMAILS=info.formulaihu@ihu.gr,technical.formulaihu@ihu.gr,admin@example.com
```

## Security Notes

- Never commit `.env.local` to version control
- Keep your `RESEND_API_KEY` secret
- Use environment variables in your hosting platform for production
- Consider using different email addresses for different form types if needed

