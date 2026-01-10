import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable. Please add it to your .env.local file.'
  );
}

export const client = createClient({
  projectId,
  dataset,
  useCdn: false, // Changed from true to false
  apiVersion: '2024-01-01',
  // Note: To query drafts, you may need a token with draft access
  // For now, we handle draft team references in getResults by querying by exact ID
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

