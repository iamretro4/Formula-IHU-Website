import { Trophy, Medal, Award } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import clsx from 'clsx';

interface ResultCardProps {
  result: any;
  index: number;
}

export default function ResultCard({ result, index }: ResultCardProps) {
  const isTopThree = index < 3;
  const medalIcons = [Trophy, Medal, Award];
  const MedalIcon = isTopThree ? medalIcons[index] : null;

  return (
    <Card
      className={clsx(
        'relative overflow-hidden',
        index === 0 && 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300',
        index === 1 && 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300',
        index === 2 && 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300',
        !isTopThree && 'bg-white border-gray-200'
      )}
    >
      {isTopThree && (
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          {MedalIcon && <MedalIcon className="w-full h-full text-gray-400" />}
        </div>
      )}
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl',
            index === 0 && 'bg-yellow-400 text-yellow-900',
            index === 1 && 'bg-gray-300 text-gray-800',
            index === 2 && 'bg-orange-400 text-orange-900',
            !isTopThree && 'bg-gray-200 text-gray-700'
          )}>
            {result.position}
          </div>
          {isTopThree && (
            <Badge variant={index === 0 ? 'warning' : index === 1 ? 'default' : 'warning'}>
              {index === 0 ? '🥇 Gold' : index === 1 ? '🥈 Silver' : '🥉 Bronze'}
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {result.team?.name || 'Unknown Team'}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary-blue">{result.points}</span>
          <span className="text-sm text-gray-500">points</span>
        </div>
        {result.awards && result.awards.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Awards</p>
            <div className="flex flex-wrap gap-1">
              {result.awards.map((award: string, i: number) => (
                <Badge key={i} variant="primary" size="sm">
                  {award}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

