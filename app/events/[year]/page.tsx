import { notFound } from 'next/navigation';
import { getEventByYear, getEventDocuments, getRegisteredTeams, getResults } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';
import ResultCard from '@/components/ResultCard';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateStructuredData } from '@/lib/seo';
import type { Metadata } from 'next';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return generateSEOMetadata({ title: "Event Not Found" });
  }

  const event = await getEventByYear(yearNum).catch(() => null);
  
  if (!event) {
    return generateSEOMetadata({ title: "Event Not Found" });
  }

  const eventImageUrl = event.featuredImage
    ? urlFor(event.featuredImage).width(1200).height(630).url()
    : undefined;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  return generateSEOMetadata({
    title: event.title || `Formula IHU ${year}`,
    description: event.description || `Join Formula IHU ${year} - The official Formula Student Competition in Greece. ${event.location ? `Held in ${event.location}.` : ''} ${event.startDate ? `Event dates: ${new Date(event.startDate).toLocaleDateString()}` : ''}`,
    image: eventImageUrl,
    url: `/events/${year}`,
    type: 'website',
  });
}

export default async function EventPage({
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

  const [documents, teams, results] = await Promise.all([
    getEventDocuments(event._id).catch(() => []),
    getRegisteredTeams(event._id).catch(() => []),
    getResults(event._id).catch(() => []),
  ]);

  // Get overall results for preview (top 3 from each category)
  const overallResultsRaw = results.filter((r: any) => r.subcategory === 'overall');
  
  // Get top 3 from EV category
  const evResults = overallResultsRaw
    .filter((r: any) => r.category === 'EV')
    .sort((a: any, b: any) => a.position - b.position)
    .slice(0, 3);
  
  // Get top 3 from CV category
  const cvResults = overallResultsRaw
    .filter((r: any) => r.category === 'CV')
    .sort((a: any, b: any) => a.position - b.position)
    .slice(0, 3);
  
  // Combine EV and CV results (EV first, then CV)
  const overallResults = [...evResults, ...cvResults];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateISO = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  // Generate Event structured data
  const eventStructuredData = generateStructuredData({
    type: 'Event',
    data: {
      name: event.title,
      startDate: formatDateISO(event.startDate),
      endDate: formatDateISO(event.endDate),
      locationName: event.venue || event.location || 'Serres, Greece',
      addressLocality: event.location?.includes('Serres') ? 'Serres' : 'Serres',
      description: event.description || `${event.title} - Formula Student Competition in Greece`,
      image: event.featuredImage ? urlFor(event.featuredImage).width(1200).height(630).url() : undefined,
      ...(event.registrationOpen && {
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr'}/events/${year}`,
        },
      }),
    },
  });

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr'}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Events',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr'}/events`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: event.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr'}/events/${year}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="mb-8">
            <Link href="/events" className="text-[#0066FF] hover:text-[#0052CC] mb-4 inline-block font-bold">
              ← Back to Events
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-700">
            <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
            <span>•</span>
            <span>{event.location}</span>
            {event.venue && (
              <>
                <span>•</span>
                <span>{event.venue}</span>
              </>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {event.featuredImage && (
          <div className="relative h-96 w-full mb-12 rounded-lg overflow-hidden">
            <Image
              src={urlFor(event.featuredImage).width(1200).height(400).url()}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Description */}
            {event.description && (
              <div className="mb-12">
                <p className="text-lg text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
            )}

        {/* Registration Quiz Guidelines - Only show for 2026 */}
        {yearNum === 2026 && (
          <section className="mb-12">
            <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                Formula IHU 2026: Registration Quiz Guidelines
              </h2>
              
              <div className="space-y-6 text-left max-w-3xl mx-auto">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Registration Process</h3>
                  <p className="text-gray-700">
                    Teams do not need to pre-register for the Formula IHU registration quiz. According to the handbook, you simply need to access the site, input your team details (Name, Email, and Vehicle Category), and begin the test. The quiz page will appear automatically at 13:00 CET on fihu.gr. The interface is similar to a Google Form. As long as you have an active Formula Student Germany (FSG) 2026 account, you are eligible.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Schedule & Access</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Date:</strong> January 29, 2026</li>
                    <li><strong>Time:</strong> 13:00 CET (Duration: 2 Hours)</li>
                    <li><strong>Location:</strong> fihu.gr</li>
                    <li><strong>Note:</strong> The quiz will appear automatically at 13:00 CET. If it does not, you may reload the page. However, do not refresh the page once you have started the quiz.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Required Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">When the quiz begins, you must input the following:</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li><strong>Team Name:</strong> Official name as registered with your university.</li>
                        <li><strong>Team Email:</strong> Valid email for official communication.</li>
                        <li><strong>Vehicle Category:</strong> EV or CV.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">When you submit the quiz, you must input the following:</p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                        <li><strong>Team Numbers:</strong> Preferred and alternative choices (e.g., E88, C12).</li>
                        <li><strong>Fuel Type:</strong> (CV Teams only) RON98 or E85.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Scoring & Rules</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li><strong>Format:</strong> 10–20 Questions.</li>
                    <li><strong>Submission:</strong> Only the first submission recorded is accepted. No edits allowed.</li>
                    <li><strong>Scoring:</strong>
                      <ul className="list-circle list-inside ml-6 mt-1 space-y-1">
                        <li><strong>Correct:</strong> Full points.</li>
                        <li><strong>Incorrect:</strong> -50% of the question&apos;s points deducted.</li>
                        <li><strong>Unanswered:</strong> 0 points (no change).</li>
                      </ul>
                    </li>
                    <li><strong>Tie-Breaker:</strong> In the event of a tie, the team with the faster submission time wins.</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mt-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ Important Update: Protest Deadline</h3>
                  <p className="text-yellow-800 mb-2">
                    <strong>The deadline for submitting protests is 29 January 2026 at 22:00 CET.</strong>
                  </p>
                  <p className="text-yellow-800">
                    All protests must be submitted via email to <a href="mailto:technical.formulaihu@ihu.gr" className="underline font-semibold">technical.formulaihu@ihu.gr</a>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link
                  href="/team-portal"
                  className="px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  View Full Guidelines
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Quick Info */}
        {event.registrationOpen && (
          <div className="mb-12">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all max-w-md">
              <h3 className="font-bold text-blue-900 mb-2">Registration Open</h3>
              {event.registrationDeadline && (
                <p className="text-sm text-blue-700">
                  Deadline: {formatDate(event.registrationDeadline)}
                </p>
              )}
            </div>
          </div>
        )}


        {/* Documents */}
        {documents.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.slice(0, 6).map((doc: any) => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
            </div>
                <Link
                  href={`/events/${year}/documents`}
                  className="mt-4 inline-block text-[#0066FF] hover:text-[#0052CC] font-bold"
                >
                  View All Documents →
                </Link>
          </section>
        ) : (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Documents</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
                  <div className="text-7xl mb-6">📄</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Documents Yet</h3>
                  <p className="text-gray-700 text-lg">Event documents will be posted here once they are available.</p>
                </div>
              </section>
        )}

        {/* Results - Only show for past or current events, not upcoming */}
        {event.status === 'past' || event.status === 'current' ? (
          results.length > 0 ? (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Results</h2>
                <Link
                  href={`/events/${year}/results`}
                  className="text-[#0066FF] hover:text-[#0052CC] font-bold"
                >
                  View All Results →
                </Link>
              </div>
              {overallResults.length > 0 ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Overall Standings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {overallResults.map((result: any, index: number) => {
                      // Calculate index within category (0-2 for top 3 in each category)
                      const categoryIndex = result.category === 'EV' 
                        ? evResults.findIndex((r: any) => r._id === result._id)
                        : cvResults.findIndex((r: any) => r._id === result._id);
                      return (
                        <ResultCard key={result._id} result={result} index={categoryIndex} />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-gray-200">
                  <p className="text-gray-700">View detailed results by category and subcategory.</p>
                </div>
              )}
            </section>
          ) : (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Results</h2>
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
                <div className="text-7xl mb-6">🏁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Results Coming Soon</h3>
                <p className="text-gray-700 text-lg">Competition results will be posted here once the event concludes.</p>
              </div>
            </section>
          )
        ) : null}



      </div>
    </div>
    </>
  );
}

