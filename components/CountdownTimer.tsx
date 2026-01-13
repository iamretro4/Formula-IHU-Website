'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  eventTitle?: string;
}

const calculateTime = (targetDate: string) => {
  const difference = new Date(targetDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return null;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export default function CountdownTimer({ targetDate, eventTitle }: CountdownTimerProps) {
  // Start with null to ensure server and client render the same initial state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only calculate time after component mounts on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const updateTime = () => {
      const newTime = calculateTime(targetDate);
      if (newTime) {
        setTimeLeft(newTime);
        setIsExpired(false);
      } else {
        setIsExpired(true);
        setTimeLeft(null);
      }
    };

    // Calculate immediately on mount
    updateTime();

    // Then update every second
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Show nothing until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F45FC] via-[#4A6BFD] to-[#1A3AE0]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"></div>
        <div className="relative z-10 px-8 py-6 md:px-12 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="relative bg-white/15 backdrop-blur-lg border-2 border-white/30 rounded-xl px-4 py-6 md:px-6 md:py-8 shadow-xl">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                    --
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-center py-6">
        <p className="text-xl font-bold text-white">Event has started!</p>
      </div>
    );
  }

  if (timeLeft === null) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F45FC] via-[#4A6BFD] to-[#1A3AE0]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)]"></div>
      
      {/* Content */}
      <div className="relative z-10 px-8 py-6 md:px-12 md:py-10">
        {eventTitle && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-white/95" />
            <h3 className="text-base md:text-lg font-semibold text-white/95 tracking-wide">
              {eventTitle}
            </h3>
          </div>
        )}
        
        {/* Countdown display */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Days */}
          <div className="text-center">
            <div className="relative bg-white/15 backdrop-blur-lg border-2 border-white/30 rounded-xl px-4 py-6 md:px-6 md:py-8 shadow-xl">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-widest">
                Days
              </div>
            </div>
          </div>
          
          {/* Hours */}
          <div className="text-center">
            <div className="relative bg-white/15 backdrop-blur-lg border-2 border-white/30 rounded-xl px-4 py-6 md:px-6 md:py-8 shadow-xl">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-widest">
                Hours
              </div>
            </div>
          </div>
          
          {/* Minutes */}
          <div className="text-center">
            <div className="relative bg-white/15 backdrop-blur-lg border-2 border-white/30 rounded-xl px-4 py-6 md:px-6 md:py-8 shadow-xl">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-widest">
                Minutes
              </div>
            </div>
          </div>
          
          {/* Seconds */}
          <div className="text-center">
            <div className="relative bg-white/15 backdrop-blur-lg border-2 border-white/30 rounded-xl px-4 py-6 md:px-6 md:py-8 shadow-xl">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-widest">
                Seconds
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

