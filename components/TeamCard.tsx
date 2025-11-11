import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { ExternalLink, MapPin, GraduationCap } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface TeamCardProps {
  team: any;
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="h-full flex flex-col group">
      <div className="flex-1">
        {team.logo ? (
          <div className="relative h-32 w-full mb-4 flex items-center justify-center bg-gray-50 rounded-xl p-4 group-hover:bg-gray-100 transition-colors">
            <Image
              src={urlFor(team.logo).width(200).height(100).url()}
              alt={team.name}
              width={200}
              height={100}
              className="object-contain max-h-24"
            />
          </div>
        ) : (
          <div className="h-32 w-full mb-4 flex items-center justify-center bg-gray-100 rounded-xl">
            <GraduationCap className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-blue transition-colors">
          {team.name}
        </h3>
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <GraduationCap className="w-4 h-4 text-primary-blue" />
            <span>{team.university}</span>
          </div>
          {team.country && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-primary-blue" />
              <span>{team.country}</span>
            </div>
          )}
        </div>
        {team.category && (
          <Badge variant="primary" className="mb-3">
            {team.category}
          </Badge>
        )}
      </div>
      {team.website && (
        <a
          href={team.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-primary-blue hover:text-primary-blue-dark font-semibold text-sm transition-all group/link"
        >
          Visit Website
          <ExternalLink className="w-4 h-4 ml-2 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </a>
      )}
    </Card>
  );
}

