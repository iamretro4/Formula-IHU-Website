import Link from 'next/link';
import { getEvents } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

const statusLabels: Record<string, string> = {
  upcoming: 'Upcoming',
  current: 'Current',
  past: 'Past',
};

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  current: 'bg-green-100 text-green-800',
  past: 'bg-gray-100 text-gray-800',
};

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function EventsPage() {
  const allEvents = await getEvents().catch(() => []);
  
  const upcomingEvents = allEvents.filter((e: any) => e.status === 'upcoming');
  const currentEvents = allEvents.filter((e: any) => e.status === 'current');
  const pastEvents = allEvents.filter((e: any) => e.status === 'past');

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Event Archive</h1>
          <p className="text-xl text-gray-700">
            Browse all Formula IHU events, past and present.
          </p>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: any) => (
                <Link
                  key={event._id}
                  href={`/events/${event.year}`}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#0066FF] hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  {event.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={urlFor(event.featuredImage).width(400).height(200).url()}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status] || statusColors.past}`}>
                        {statusLabels[event.status] || 'Past'}
                      </span>
                      <span className="text-sm text-gray-500">{event.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Current Events */}
        {currentEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event: any) => (
                <Link
                  key={event._id}
                  href={`/events/${event.year}`}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#0066FF] hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  {event.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={urlFor(event.featuredImage).width(400).height(200).url()}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status] || statusColors.past}`}>
                        {statusLabels[event.status] || 'Past'}
                      </span>
                      <span className="text-sm text-gray-500">{event.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event: any) => (
                <Link
                  key={event._id}
                  href={`/events/${event.year}`}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-[#0066FF] hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  {event.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={urlFor(event.featuredImage).width(400).height(200).url()}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[event.status] || statusColors.past}`}>
                        {statusLabels[event.status] || 'Past'}
                      </span>
                      <span className="text-sm text-gray-500">{event.year}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {allEvents.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-16 text-center border-2 border-gray-200">
            <div className="text-7xl mb-6">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Yet</h3>
            <p className="text-gray-700 text-lg">Events will be posted here once they are announced. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

