'use client';

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import dynamic from 'next/dynamic';

const Studio = dynamic(
  () =>
    Promise.all([
      import('next-sanity/studio').then((mod) => mod.NextStudio),
      import('../../../sanity.config'),
    ]).then(([NextStudio, config]) => {
      return function StudioComponent() {
        return <NextStudio config={config.default} />;
      };
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function StudioPage() {
  return <Studio />;
}

