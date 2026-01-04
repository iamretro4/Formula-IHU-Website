import { notFound } from 'next/navigation';
import { getEventByYear, getResults } from '@/lib/sanity.queries';
import Link from 'next/link';

export const revalidate = 60;

const subcategoryLabels: Record<string, string> = {
  'overall': 'Overall',
  'engineering-design': 'Engineering Design',
  'cost-manufacturing': 'Cost & Manufacturing',
  'business-plan': 'Business Plan',
  'acceleration': 'Acceleration',
  'skidpad': 'Skidpad',
  'autocross': 'Autocross',
  'endurance': 'Endurance',
  'efficiency': 'Efficiency',
};

const categoryLabels: Record<string, string> = {
  'CV': 'Combustion Vehicle',
  'EV': 'Electric Vehicle',
  'DV': 'Driverless',
};

// Define subcategory order: Overall first, then static events, then dynamic events
const subcategoryOrder = [
  'overall',
  'engineering-design',
  'cost-manufacturing',
  'business-plan',
  'acceleration',
  'skidpad',
  'autocross',
  'endurance',
  'efficiency',
];

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ category?: string; subcategory?: string }>;
}) {
  const { year } = await params;
  const { category, subcategory } = await searchParams;
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    notFound();
  }

  const event = await getEventByYear(yearNum).catch(() => null);
  
  if (!event) {
    notFound();
  }

  // Fetch results for this event
  const allResults = await getResults(event._id, category || undefined, subcategory || undefined).catch(() => []);

  // Group results by category and subcategory
  const groupedResults: Record<string, Record<string, any[]>> = {};
  
  allResults.forEach((result: any) => {
    const cat = result.category || 'Other';
    const subcat = result.subcategory || 'other';
    
    if (!groupedResults[cat]) {
      groupedResults[cat] = {};
    }
    if (!groupedResults[cat][subcat]) {
      groupedResults[cat][subcat] = [];
    }
    groupedResults[cat][subcat].push(result);
  });

  // Sort each subcategory by position
  Object.keys(groupedResults).forEach(cat => {
    Object.keys(groupedResults[cat]).forEach(subcat => {
      groupedResults[cat][subcat].sort((a: any, b: any) => a.position - b.position);
    });
  });

  // Function to get sorted subcategories for a category (overall first, then by defined order)
  const getSortedSubcategories = (subcats: Record<string, any[]>) => {
    const sorted: string[] = [];
    
    // Always add overall first if it exists
    if (subcats['overall']) {
      sorted.push('overall');
    }
    
    // Then add others in defined order
    subcategoryOrder.forEach(subcat => {
      if (subcat !== 'overall' && subcats[subcat]) {
        sorted.push(subcat);
      }
    });
    
    // Add any remaining subcategories not in the order list
    Object.keys(subcats).forEach(subcat => {
      if (!sorted.includes(subcat)) {
        sorted.push(subcat);
      }
    });
    
    return sorted;
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/events/${year}`} className="text-[#0066FF] hover:text-[#0052CC] mb-4 inline-block font-bold">
            ← Back to Event
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {event.title} {event.year} - Results
          </h1>
          <p className="text-gray-600">
            Competition results and rankings
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            href={`/events/${year}/results`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !category && !subcategory
                ? 'bg-[#0066FF] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Results
          </Link>
          {['CV', 'EV'].map((cat) => (
            <Link
              key={cat}
              href={`/events/${year}/results?category=${cat}`}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === cat
                  ? 'bg-[#0066FF] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[cat] || cat}
            </Link>
          ))}
        </div>

        {/* Results by Category and Subcategory */}
        {Object.keys(groupedResults).length === 0 ? (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
            <div className="text-7xl mb-6">🏁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Results Available</h3>
            <p className="text-gray-700 text-lg">Results will be posted here once they are available.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {['CV', 'EV', 'DV'].filter(cat => groupedResults[cat]).map((category) => (
              <div key={category}>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">
                  {categoryLabels[category] || category}
                </h2>
                
                <div className="space-y-10">
                  {getSortedSubcategories(groupedResults[category]).map((subcategory) => {
                    const results = groupedResults[category][subcategory];
                    return (
                      <div key={subcategory} className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                          {subcategoryLabels[subcategory] || subcategory}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 border-gray-300">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Position</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Team</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">University</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((result: any) => (
                                <tr 
                                  key={result._id} 
                                  className={`border-b border-gray-200 hover:bg-white transition-colors ${
                                    result.position === 1 ? 'bg-yellow-50' : 
                                    result.position === 2 ? 'bg-gray-100' : 
                                    result.position === 3 ? 'bg-orange-50' : ''
                                  }`}
                                >
                                  <td className="py-3 px-4">
                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                      result.position === 1 ? 'bg-yellow-400 text-yellow-900' : 
                                      result.position === 2 ? 'bg-gray-300 text-gray-800' : 
                                      result.position === 3 ? 'bg-orange-400 text-orange-900' : 
                                      'bg-gray-200 text-gray-700'
                                    }`}>
                                      {result.position}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 font-medium text-gray-900">
                                    {result.team?.name || 'Unknown Team'}
                                  </td>
                                  <td className="py-3 px-4 text-gray-600">
                                    {result.team?.university || '-'}
                                  </td>
                                  <td className="py-3 px-4 text-gray-600">
                                    {result.team?.country || '-'}
                                  </td>
                                  <td className="py-3 px-4 text-right font-semibold text-gray-900">
                                    {result.points || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

