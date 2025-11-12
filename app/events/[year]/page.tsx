import { notFound } from 'next/navigation';
import { getEventByYear, getEventDocuments, getSchedule, getRegisteredTeams, getResults, getAwards, getGalleryImages } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import DocumentCard from '@/components/DocumentCard';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

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

  const [documents, schedule, teams, results, awards, gallery] = await Promise.all([
    getEventDocuments(event._id).catch(() => []),
    getSchedule(event._id).catch(() => []),
    getRegisteredTeams(event._id).catch(() => []),
    getResults(event._id).catch(() => []),
    getAwards(event._id).catch(() => []),
    getGalleryImages(event._id, undefined, true).catch(() => []),
  ]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {event.registrationOpen && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all">
                <h3 className="font-bold text-blue-900 mb-2">Registration Open</h3>
                {event.registrationDeadline && (
                  <p className="text-sm text-blue-700">
                  Deadline: {formatDate(event.registrationDeadline)}
                </p>
              )}
            </div>
          )}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Status</h3>
                <p className="text-sm text-gray-700 capitalize">{event.status}</p>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all">
                <h3 className="font-bold text-gray-900 mb-2">Year</h3>
                <p className="text-sm text-gray-700">{event.year}</p>
          </div>
        </div>

        {/* Schedule */}
        {schedule.length > 0 ? (
          <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Schedule</h2>
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <div className="space-y-4">
                {schedule.map((item: any) => (
                      <div key={item._id} className="border-b-2 border-gray-200 pb-4 last:border-0 hover:bg-gray-100 rounded p-2 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="mt-2 md:mt-0 text-sm text-gray-600">
                        <span>{formatDate(item.date)}</span>
                        {item.time && <span className="ml-2">{formatTime(item.time)}</span>}
                        {item.location && <span className="ml-2">• {item.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                <Link
                  href={`/events/${year}/schedule`}
                  className="mt-4 inline-block text-[#0066FF] hover:text-[#0052CC] font-bold"
                >
                  View Full Schedule →
                </Link>
          </section>
        ) : (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Schedule</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
                  <div className="text-7xl mb-6">📅</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Schedule Coming Soon</h3>
                  <p className="text-gray-700 text-lg">The detailed schedule for this event will be posted here.</p>
                </div>
              </section>
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

        {/* Teams */}
        {teams.length > 0 ? (
          <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Registered Teams ({teams.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.slice(0, 9).map((team: any) => (
                    <div key={team._id} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-[#0066FF] hover:shadow-xl transition-all transform hover:-translate-y-2">
                      <h3 className="font-bold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-600">{team.university}</p>
                      {team.country && (
                        <p className="text-xs text-gray-500 mt-1">{team.country}</p>
                      )}
                </div>
              ))}
            </div>
                <Link
                  href={`/events/${year}/teams`}
                  className="mt-4 inline-block text-[#0066FF] hover:text-[#0052CC] font-bold"
                >
                  View All Teams →
                </Link>
          </section>
        ) : (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Registered Teams</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
                  <div className="text-7xl mb-6">🏎️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No Teams Registered Yet</h3>
                  <p className="text-gray-700 text-lg">Team registrations will appear here once they are confirmed.</p>
                </div>
              </section>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Results</h2>
                <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y-2 divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Position</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Team</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Points</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y-2 divide-gray-200">
                        {results.slice(0, 10).map((result: any) => (
                          <tr key={result._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {result.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.team?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {result.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {result.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Link
                  href={`/events/${year}/results`}
                  className="mt-4 inline-block text-[#0066FF] hover:text-[#0052CC] font-bold"
                >
                  View Full Results →
                </Link>
          </section>
        ) : (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Results</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
                  <div className="text-7xl mb-6">🏁</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Results Coming Soon</h3>
                  <p className="text-gray-700 text-lg">Competition results will be posted here after the event.</p>
                </div>
              </section>
        )}

        {/* Awards */}
        {awards.length > 0 ? (
          <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Awards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {awards.map((award: any) => (
                    <div key={award._id} className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-[#0066FF] hover:shadow-xl transition-all transform hover:-translate-y-2">
                      <h3 className="font-bold text-gray-900 mb-2">{award.name}</h3>
                      {award.description && (
                        <p className="text-sm text-gray-600 mb-3">{award.description}</p>
                      )}
                      {award.winner && (
                        <p className="text-sm font-bold text-gray-900">
                          Winner: {award.winner.name}
                        </p>
                      )}
                      {award.prize && (
                        <p className="text-sm text-gray-600 mt-1">Prize: {award.prize}</p>
                      )}
                </div>
              ))}
            </div>
          </section>
        ) : (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Awards</h2>
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
                  <div className="text-7xl mb-6">🏆</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Awards Coming Soon</h3>
                  <p className="text-gray-700 text-lg">Award winners will be announced after the competition.</p>
                </div>
              </section>
        )}

        {/* Gallery Preview */}
        {gallery.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.slice(0, 8).map((item: any) => (
                <div
                  key={item._id}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={urlFor(item.image).width(300).height(300).url()}
                    alt={item.caption || 'Gallery image'}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

