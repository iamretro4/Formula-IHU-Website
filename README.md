# Formula IHU Website

A modern, responsive website for Formula IHU - the official Formula Student Competition held in Greece.

## Features

- **Modern Racing-Inspired Design**: Clean, modern design with racing-inspired accents and animations
- **Enhanced UX**: Smooth scroll animations, interactive components, and improved mobile experience
- **CMS Integration**: Content management powered by Sanity.io
- **All Pages**: Home, About, Sponsors, Join Us, Contact, Rules & Documents, and Team Portal
- **Interactive Features**: Countdown timers, animated statistics, image galleries, and more
- **SEO Optimized**: Built-in SEO features with Next.js
- **Type Safe**: Full TypeScript support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity.io
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Sanity.io account (for CMS functionality)

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd "Formula IHU Public Website"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure Sanity:
   - Create a new project at [sanity.io](https://www.sanity.io)
   - Get your Project ID and Dataset name
   - Update `.env.local` with your credentials:
     ```
     NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
     NEXT_PUBLIC_SANITY_DATASET=production
     SANITY_API_TOKEN=your_api_token
     ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Sanity Studio

Access the Sanity Studio at [http://localhost:3000/studio](http://localhost:3000/studio) to manage content.

## Project Structure

```
Formula IHU Public Website/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── sponsors/          # Sponsors page
│   ├── join-us/           # Join Us page
│   ├── contact/           # Contact page
│   ├── rules/             # Rules & Documents page
│   ├── team-portal/       # Team Portal page
│   └── studio/            # Sanity Studio
├── components/            # React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── NewsSection.tsx
│   └── DocumentCard.tsx
├── lib/                   # Utility functions
│   ├── sanity.ts         # Sanity client
│   └── sanity.queries.ts # Sanity queries
├── sanity/               # Sanity configuration
│   └── schemas/         # Content schemas
└── public/              # Static assets
```

## Content Management

The website uses Sanity.io as a headless CMS. Content types include:

- **News & Announcements**: Blog posts and news updates
- **Documents**: Competition handbooks, rules, and results
- **Sponsors**: Sponsor information with logos and tiers
- **Page Content**: Flexible content for About, Join Us, and Contact pages
- **Site Settings**: Global site configuration

## Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Environment Variables

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Your Sanity dataset name (usually "production")
- `SANITY_API_TOKEN`: Your Sanity API token (for write operations)
- `STUDIO_PASSWORD`: Password to access Sanity Studio (defaults to 'admin' if not set)
- `REVALIDATE_SECRET`: Secret token for on-demand revalidation webhook (generate a random string)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (for quiz functionality)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (for quiz functionality)
- `RESEND_API_KEY`: Resend API key for sending quiz confirmation emails (optional)
- `FROM_EMAIL`: Email address to send from (optional, defaults to 'Formula IHU <noreply@fihu.gr>')

## CMS Content Updates

The site uses Next.js static generation with revalidation. When you update content in Sanity CMS, you have two options to see changes on the deployed site:

### Option 1: Automatic Revalidation via Webhook (Recommended)

Set up a Sanity webhook to automatically trigger revalidation when content changes:

1. **Get your revalidation endpoint URL:**
   - Your deployed site URL: `https://yourdomain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
   - Replace `YOUR_REVALIDATE_SECRET` with the value from your environment variables

2. **Configure Sanity Webhook:**
   - Go to [Sanity Manage](https://www.sanity.io/manage)
   - Select your project
   - Navigate to **API** → **Webhooks**
   - Click **Create webhook**
   - **Name**: "Vercel Revalidation" (or any name)
   - **URL**: `https://yourdomain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **Filter**: Leave empty (or customize if needed)
   - **HTTP method**: POST
   - **API version**: 2021-03-25 or later
   - Click **Save**

3. **Alternative: Use Vercel Deploy Hook (Simpler)**
   - Go to Vercel Dashboard → Your Project → Settings → Git → Deploy Hooks
   - Create a new hook named "Sanity Updates"
   - Copy the hook URL
   - Use this URL in your Sanity webhook instead of the revalidation endpoint
   - This will trigger a full rebuild instead of on-demand revalidation

### Option 2: Time-based Revalidation (Fallback)

All pages have a 60-second revalidation interval as a fallback. This means pages will automatically refresh their content every 60 seconds, even without webhooks. However, webhooks provide instant updates.

### Testing Revalidation

After setting up the webhook, test it by:
1. Making a change in Sanity Studio
2. Publishing the change
3. The webhook should trigger automatically
4. Check your site within a few seconds to see the update

## License

This project is private and proprietary.

## Support

For questions or support, contact:
- Email: info.formulaihu@ihu.gr
- Technical: technical.formulaihu@ihu.gr
# Formula-IHU-Website
