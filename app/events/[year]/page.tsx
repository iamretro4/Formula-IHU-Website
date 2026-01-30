import { notFound } from 'next/navigation';
import { getEventByYear, getEventDocuments, getRegisteredTeams, getResults } from '@/lib/sanity.queries';
import { getRegistrationQuizResults } from '@/lib/registration-results';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';
import ResultCard from '@/components/ResultCard';
import RegistrationQuizResults from '@/components/RegistrationQuizResults';
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

  const [documents, teams, results, registrationResults] = await Promise.all([
    getEventDocuments(event._id).catch(() => []),
    getRegisteredTeams(event._id).catch(() => []),
    getResults(event._id).catch(() => []),
    yearNum === 2026 ? getRegistrationQuizResults() : Promise.resolve(null),
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

        {/* Registration Quiz Results - FIHU 2026 */}
        {yearNum === 2026 && registrationResults && (
          <div className="mb-12">
            <RegistrationQuizResults
              ev={registrationResults.ev}
              cv={registrationResults.cv}
              eventYear={yearNum}
              eventHref={null}
            />
          </div>
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

