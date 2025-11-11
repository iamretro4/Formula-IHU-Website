'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

interface CountdownTimerProps {
  targetDate: string;
  eventTitle?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate, eventTitle }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <Card className="text-center py-8">
        <p className="text-xl font-bold text-gray-900">Event has started!</p>
      </Card>
    );
  }

  if (!timeLeft) {
    return null;
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="bg-gradient-primary text-white border-0 shadow-xl rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Clock className="w-5 h-5" />
        {eventTitle && (
          <h3 className="text-lg font-semibold">{eventTitle}</h3>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {timeUnits.map((unit, index) => (
          <div
            key={unit.label}
            className="text-center animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-2">
              <div className="text-3xl md:text-4xl font-bold">
                {String(unit.value).padStart(2, '0')}
              </div>
            </div>
            <div className="text-sm font-medium opacity-90">{unit.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

