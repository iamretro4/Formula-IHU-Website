# Email Setup Instructions

This document explains how to set up email sending for the quiz submission confirmation emails.

## Option 1: Using Resend (Recommended)

Resend is a modern email API that works great with Next.js.

### Steps:

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create a free account (100 emails/day free tier)

2. **Get your API Key**
   - Go to https://resend.com/api-keys
   - Create a new API key
   - Copy the key

3. **Add to Environment Variables**
   - Create or update `.env.local` in your project root
   - Add the following:
     ```
     RESEND_API_KEY=re_xxxxxxxxxxxxx
     FROM_EMAIL=Formula IHU <noreply@fihu.gr>
     ```
   - Replace `re_xxxxxxxxxxxxx` with your actual Resend API key
   - Update `FROM_EMAIL` with your verified domain email

4. **Verify Your Domain (for production)**
   - In Resend dashboard, go to Domains
   - Add and verify your domain (e.g., fihu.gr)
   - This allows you to send from your own domain

## Option 2: Using Other Email Services

You can modify `app/api/send-quiz-email/route.ts` to use:
- **SendGrid**: https://sendgrid.com
- **Mailgun**: https://mailgun.com
- **AWS SES**: https://aws.amazon.com/ses/
- **Nodemailer**: For SMTP servers

### Example with Nodemailer (SMTP):

1. Install nodemailer:
   ```bash
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

2. Update the email route to use nodemailer instead of Resend

## Testing

In development mode (without RESEND_API_KEY), the email will be logged to the console instead of being sent. This allows you to test the email template without setting up the service.

## Email Template

The email template includes:
- Team name and confirmation message
- Time taken to complete the quiz
- Complete list of questions and answers
- Professional styling matching Formula IHU branding

The template is generated in `app/api/send-quiz-email/route.ts` in the `generateEmailTemplate` function.

