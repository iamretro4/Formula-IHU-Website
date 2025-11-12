import { notFound } from 'next/navigation';
import { getEventByYear, getResults } from '@/lib/sanity.queries';
import Link from 'next/link';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function YearResultsPage({
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
  const allResults = await getResults(event?._id).catch(() => []);

  // Filter results for this year
  const yearResults = allResults.filter((r: any) => 
    r.year === yearNum || r.event?.year === yearNum
  );

  if (yearResults.length === 0 && !event) {
    notFound();
  }

  // Group results by category
  const resultsByCategory = yearResults.reduce((acc: any, result: any) => {
    const category = result.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {});

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/results" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Results Archive
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Results - Formula IHU {year}
        </h1>
        
        {yearResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results available for this year.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(resultsByCategory).map(([category, results]: [string, any]) => (
              <section key={category}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category} Category</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Position
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            University
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Country
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Points
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Awards
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result: any, index: number) => (
                          <tr key={result._id} className={index < 3 ? 'bg-yellow-50' : ''}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-lg font-semibold ${
                                index === 0 ? 'text-yellow-600' : 
                                index === 1 ? 'text-gray-400' : 
                                index === 2 ? 'text-orange-600' : 
                                'text-gray-900'
                              }`}>
                                {result.position}
                                {index === 0 && ' 🥇'}
                                {index === 1 && ' 🥈'}
                                {index === 2 && ' 🥉'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.team?.name || 'Unknown Team'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.team?.university || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.team?.country || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {result.points}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {result.awards && result.awards.length > 0 ? (
                                <ul className="list-disc list-inside">
                                  {result.awards.map((award: string, i: number) => (
                                    <li key={i}>{award}</li>
                                  ))}
                                </ul>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

