import { getDocuments } from '@/lib/sanity.queries';
import DocumentCard from '@/components/DocumentCard';
import { FileText, Download, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';

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
    .then(docs => docs.filter((doc: any) => 
      doc.category !== 'handbook' && 
      doc.category !== 'event-handbook' &&
      !(doc.title?.toLowerCase().includes('schedule') && doc.title?.includes('2025'))
    ))
    .catch(() => []);
  const categories = Array.from(new Set(allDocuments.map((doc: any) => doc.category)));

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Rules & Documents</h1>
        <p className="text-lg text-gray-600 mb-12">
          Find all competition rules, handbooks, results, and important documents here.
        </p>

        <div className="space-y-12">
          {/* Rules Section - Always show, with Formula Student Rules 2026 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
              {categoryLabels['rules'] || 'Rules'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Formula Student Rules 2026 - External Link */}
              <Card className="h-full flex flex-col group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-blue/10 rounded-xl flex items-center justify-center group-hover:bg-primary-blue/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary-blue" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Rules
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                    Formula Student Rules 2026
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    The official Formula Student rules document for the 2026 season (Version 1.1).
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <a
                    href="https://www.formulastudent.de/fileadmin/user_upload/all/2026/rules/FS-Rules_2026_v1.1.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-blue hover:text-primary-blue-dark font-semibold text-sm transition-all group/link"
                  >
                    <Download className="w-4 h-4 mr-2 group-hover/link:translate-y-0.5 transition-transform" />
                    Download
                    <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </Card>
              
              {/* Other Rules Documents from Sanity */}
              {allDocuments
                .filter((doc: any) => doc.category === 'rules')
                .map((doc: any) => (
                  <DocumentCard key={doc._id} document={doc} />
                ))}
            </div>
          </div>

          {/* Other Categories */}
          {(categories as string[]).map((category: string) => {
            if (category === 'rules') return null; // Already handled above
            const categoryDocs = allDocuments.filter((doc: any) => doc.category === category);
            if (categoryDocs.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-2">
                  {categoryLabels[category] || category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {categoryDocs.map((doc: any) => (
                    <DocumentCard key={doc._id} document={doc} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

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

