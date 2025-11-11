import { PortableText, type SanityDocument } from 'next-sanity';
import { getPostBySlug, getPosts } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const options = { next: { revalidate: 30 } };

export async function generateStaticParams() {
  const posts = await getPosts().catch(() => []);
  return posts.map((post: SanityDocument) => ({
    slug: post.slug.current,
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/posts" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose prose-lg max-w-none">
        <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}

