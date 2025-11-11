import { notFound } from 'next/navigation';
import { getEventByYear, getEventDocuments } from '@/lib/sanity.queries';
import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';

export default async function EventDocumentsPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    notFound();
  }

  const event = await getEventByYear(yearNum).catch(() => null);
  
  if (!event) {
    notFound();
  }

  const documents = await getEventDocuments(event._id).catch(() => []);

  const categoryLabels: Record<string, string> = {
    handbook: 'Competition Handbook',
    'event-handbook': 'Event Handbook',
    results: 'Results',
    rules: 'Rules',
    other: 'Other',
  };

  const categories = Array.from(new Set(documents.map((doc: any) => doc.category)));

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href={`/events/${year}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to {event.title}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Documents - {event.title}</h1>
        
        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No documents available for this event.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {(categories as string[]).map((category: string) => {
              const categoryDocs = documents.filter((doc: any) => doc.category === category);
              if (categoryDocs.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                    {categoryLabels[category] || category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryDocs.map((doc: any) => (
                      <DocumentCard key={doc._id} document={doc} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

