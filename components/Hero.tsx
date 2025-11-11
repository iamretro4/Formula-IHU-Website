import Link from 'next/link';
import { getEvents } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';
import CountdownTimer from './CountdownTimer';

export default async function Hero() {
  const upcomingEvents = await getEvents('upcoming').catch(() => []);
  const currentEvents = await getEvents('current').catch(() => []);
  const featuredEvent = currentEvents[0] || upcomingEvents[0];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <section className="relative bg-gradient-hero text-white min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {featuredEvent?.featuredImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={urlFor(featuredEvent.featuredImage).width(1920).height(800).url()}
            alt={featuredEvent.title}
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-0"></div>
      
      {/* Racing stripe accent */}
      <div className="absolute inset-0 racing-stripe opacity-10 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 w-full">
        <div className="text-center animate-fade-in-up">
          <div className="mb-8 flex justify-center transform hover:scale-105 transition-transform duration-300">
            <Logo height={100} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Engineering the future, one lap at a time!
          </h1>
          
          {featuredEvent && (
            <div className="mb-10 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="glass-dark rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl border-2 border-white/20">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{featuredEvent.title}</h2>
                <p className="text-lg md:text-xl text-gray-200 mb-2">
                  {formatDate(featuredEvent.startDate)} - {formatDate(featuredEvent.endDate)}
                </p>
                <p className="text-base md:text-lg text-gray-300 mb-6">{featuredEvent.location}</p>
                
                {featuredEvent.startDate && (
                  <div className="mt-6">
                    <CountdownTimer 
                      targetDate={featuredEvent.startDate} 
                      eventTitle="Event starts in"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all focus-ring bg-white text-primary-blue border-2 border-primary-blue hover:bg-primary-blue hover:text-white shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              Learn More
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/join-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all focus-ring bg-gradient-racing text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Join Us
              <ArrowRight className="w-5 h-5" />
            </Link>
            {featuredEvent && (
              <Link
                href={`/events/${featuredEvent.year}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all focus-ring bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                View Event
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
