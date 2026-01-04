import { getDocuments } from '@/lib/sanity.queries';
import DocumentCard from '@/components/DocumentCard';

const categoryLabels: Record<string, string> = {
  handbook: 'Competition Handbook',
  'event-handbook': 'Event Handbook',
  results: 'Results',
  rules: 'Rules',
  other: 'Other',
};

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function RulesPage() {
  const allDocuments = await getDocuments()
    .then(docs => docs.filter((doc: any) => doc.category !== 'handbook' && doc.category !== 'event-handbook'))
    .catch(() => []);
  const categories = Array.from(new Set(allDocuments.map((doc: any) => doc.category)));

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Rules & Documents</h1>
        <p className="text-lg text-gray-600 mb-12">
          Find all competition rules, handbooks, results, and important documents here.
        </p>

        {allDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Documents will be available soon.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {(categories as string[]).map((category: string) => {
              const categoryDocs = allDocuments.filter((doc: any) => doc.category === category);
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

        <div className="mt-16 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Information</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              All documents are provided in PDF format. Make sure you have the latest version 
              of the competition handbook before registering your team.
            </p>
            <p>
              For questions about rules or documents, please contact us at{' '}
              <a href="mailto:technical.formulaihu@ihu.gr" className="text-blue-600 hover:text-blue-700">
                technical.formulaihu@ihu.gr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

