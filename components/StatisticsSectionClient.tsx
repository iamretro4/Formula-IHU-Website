'use client';

import { Calendar, Users, Trophy, Car, Flag, Star, TrendingUp } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';

const iconMap: Record<string, typeof Calendar> = {
  calendar: Calendar,
  users: Users,
  trophy: Trophy,
  car: Car,
  flag: Flag,
  star: Star,
  trending: TrendingUp,
};

interface Statistic {
  _id: string;
  icon: string;
  value: number;
  suffix?: string;
  label: string;
  description?: string;
}

interface StatisticsSectionClientProps {
  statistics: Statistic[];
}

export default function StatisticsSectionClient({ statistics }: StatisticsSectionClientProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // Use provided statistics or fallback to defaults
  const stats = statistics.length > 0 ? statistics : [
    { _id: '1', icon: 'trophy', value: 50, suffix: '+', label: 'Teams', description: 'Competing annually' },
    { _id: '2', icon: 'users', value: 500, suffix: '+', label: 'Participants', description: 'Students involved' },
    { _id: '3', icon: 'car', value: 10, suffix: '+', label: 'Countries', description: 'International reach' },
    { _id: '4', icon: 'flag', value: 5, suffix: '+', label: 'Events', description: 'Years running' },
  ];

  return (
    <section 
      ref={ref}
      className="py-20 bg-gradient-primary text-white relative overflow-hidden"
    >
      {/* Racing stripe accent */}
      <div className="absolute inset-0 racing-stripe opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = iconMap[stat.icon] || Trophy;
            return (
              <StatItem
                key={stat._id}
                icon={Icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
                index={index}
                inView={inView}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  description,
  index,
  inView,
}: {
  icon: typeof Calendar;
  value: number;
  suffix?: string;
  label: string;
  description?: string;
  index: number;
  inView: boolean;
}) {
  return (
    <div 
      className={clsx(
        'text-center scroll-animate',
        inView && 'visible'
      )}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="mb-4 flex justify-center">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {inView ? (
          <AnimatedCounter value={value} suffix={suffix} />
        ) : (
          <>
            {value}
            {suffix && <span className="text-2xl">{suffix}</span>}
          </>
        )}
      </div>
      <div className="text-lg font-semibold text-white mb-1">
        {label}
      </div>
      {description && (
        <div className="text-sm text-white/80">
          {description}
        </div>
      )}
    </div>
  );
}

