import Link from 'next/link';
import { getEvents, getResults } from '@/lib/sanity.queries';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function ResultsPage() {
  const events = await getEvents('past').catch(() => []);
  const allResults = await getResults().catch(() => []);

  // Group results by year
  const resultsByYear = allResults.reduce((acc: any, result: any) => {
    const year = result.year || result.event?.year || 'Unknown';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(result);
    return acc;
  }, {});

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Results Archive</h1>
        <p className="text-lg text-gray-600 mb-12">
          Browse competition results by year
        </p>

        {Object.keys(resultsByYear).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results available yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(resultsByYear)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([year, results]: [string, any]) => (
                <section key={year}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Formula IHU {year}
                    </h2>
                    <Link
                      href={`/results/${year}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Full Results →
                    </Link>
                  </div>
                  
                  {/* Group by category */}
                  {['CV', 'EV', 'DV'].map((category) => {
                    const categoryResults = results.filter((r: any) => r.category === category);
                    if (categoryResults.length === 0) return null;

                    return (
                      <div key={category} className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">{category} Category</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {categoryResults.slice(0, 3).map((result: any, index: number) => (
                              <div
                                key={result._id}
                                className={`p-4 rounded-lg transition-all transform hover:scale-105 ${
                                  index === 0 ? 'bg-yellow-100' :
                                  index === 1 ? 'bg-gray-100' :
                                  index === 2 ? 'bg-orange-100' :
                                  'bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl font-bold">
                                    {result.position}
                                    {index === 0 && ' 🥇'}
                                    {index === 1 && ' 🥈'}
                                    {index === 2 && ' 🥉'}
                                  </span>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  {result.team?.name || 'Unknown Team'}
                                </p>
                                <p className="text-sm text-gray-600">{result.points} points</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

