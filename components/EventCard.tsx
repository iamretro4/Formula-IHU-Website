import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Badge from './ui/Badge';
import { Calendar, MapPin } from 'lucide-react';

interface EventCardProps {
  event: any;
}

const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800',
  current: 'bg-green-100 text-green-800',
  past: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  upcoming: 'Upcoming',
  current: 'Current',
  past: 'Past',
};

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const badgeVariant = event.status === 'current' ? 'success' : event.status === 'upcoming' ? 'primary' : 'default';

  return (
    <Link
      href={`/events/${event.year}`}
      className="group block"
    >
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden card-hover h-full flex flex-col">
        {event.featuredImage && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={urlFor(event.featuredImage).width(400).height(200).url()}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={badgeVariant}>
                {statusLabels[event.status] || 'Past'}
              </Badge>
            </div>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            {!event.featuredImage && (
              <Badge variant={badgeVariant}>
                {statusLabels[event.status] || 'Past'}
              </Badge>
            )}
            <span className="text-sm font-semibold text-gray-500">{event.year}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
            {event.title}
          </h3>
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-primary-blue" />
              <span>
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-primary-blue" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-primary-blue font-semibold text-sm group-hover:gap-2 transition-all">
            View Details
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

