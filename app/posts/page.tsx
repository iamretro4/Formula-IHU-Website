import Link from 'next/link';
import { type SanityDocument } from 'next-sanity';
import { getPosts } from '@/lib/sanity.queries';

const options = { next: { revalidate: 30 } };

export default async function PostsPage() {
  const posts = await getPosts().catch(() => []);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post: SanityDocument) => (
          <li className="hover:underline" key={post._id}>
            <Link href={`/posts/${post.slug.current}`}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="text-gray-500">No posts found.</li>
        )}
      </ul>
    </main>
  );
}

