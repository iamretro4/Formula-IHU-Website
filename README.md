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
   cd formulaihu-website
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
formulaihu-website/
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

## License

This project is private and proprietary.

## Support

For questions or support, contact:
- Email: info.formulaihu@ihu.gr
- Technical: technical.formulaihu@ihu.gr
# Formula-IHU-Website
