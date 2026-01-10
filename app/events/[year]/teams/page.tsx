import { notFound } from 'next/navigation';
import { getEventByYear, getRegisteredTeams } from '@/lib/sanity.queries';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

export default async function EventTeamsPage({
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

  const teams = await getRegisteredTeams(event._id).catch(() => []);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href={`/events/${year}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to {event.title}
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Registered Teams - {event.title}</h1>
        <p className="text-lg text-gray-600 mb-8">
          {teams.length} team{teams.length !== 1 ? 's' : ''} registered
        </p>
        
        {teams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No teams registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team: any) => (
              <div
                key={team._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                {team.logo ? (
                  <div className="relative h-24 w-full mb-4 flex items-center justify-center">
                    <Image
                      src={urlFor(team.logo).width(200).height(100).url()}
                      alt={team.name}
                      width={200}
                      height={100}
                      className="object-contain max-h-24"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full mb-4 flex items-center justify-center bg-gray-100 rounded">
                    <span className="text-gray-400 text-sm">No logo</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{team.name}</h3>
                {team.country && (
                  <p className="text-xs text-gray-500 mb-2">{team.country}</p>
                )}
                {team.category && (
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {team.category}
                  </span>
                )}
                {team.website && (
                  <a
                    href={team.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm text-blue-600 hover:text-blue-700"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

