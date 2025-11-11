import { notFound } from 'next/navigation';
import { getEventByYear, getSchedule } from '@/lib/sanity.queries';
import Link from 'next/link';

export default async function EventSchedulePage({
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

  const schedule = await getSchedule(event._id).catch(() => []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString;
  };

  // Group schedule by date
  const scheduleByDate = schedule.reduce((acc: any, item: any) => {
    const date = item.date || 'unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href={`/events/${year}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to {event.title}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule - {event.title}</h1>
        
        {schedule.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Schedule will be available soon.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(scheduleByDate).map(([date, items]: [string, any]) => (
              <div key={date} className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {formatDate(date)}
                </h2>
                <div className="space-y-4">
                  {items.map((item: any) => (
                    <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            {item.type && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {item.type.replace('-', ' ')}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          )}
                          {item.location && (
                            <p className="text-sm text-gray-500">📍 {item.location}</p>
                          )}
                        </div>
                        {item.time && (
                          <div className="mt-2 md:mt-0 md:ml-4">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatTime(item.time)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

