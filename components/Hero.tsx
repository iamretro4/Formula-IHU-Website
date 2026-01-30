import Link from 'next/link';
import { getEvents } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Logo from './Logo';
import ImageCarousel from './ImageCarousel';

export default async function Hero() {
  const upcomingEvents = await getEvents('upcoming').catch(() => []);
  const currentEvents = await getEvents('current').catch(() => []);
  const featuredEvent = currentEvents[0] || upcomingEvents[0];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Prepare carousel images - use local HomePage images
  const carouselImages: Array<{ url: string; alt: string }> = [
    { url: '/images/home/HomePage1.jpeg', alt: 'Formula IHU Home' },
    { url: '/images/home/HomePage2.jpeg', alt: 'Formula IHU Home' },
  ];

  return (
    <section className="relative bg-gradient-hero text-white min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0 z-0">
        {carouselImages.length > 0 ? (
          <div className="relative w-full h-full opacity-40">
            <ImageCarousel
              images={carouselImages}
              autoPlay={true}
              interval={6000}
              className="h-full"
              height="h-full"
            />
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 z-0"></div>
      
      {/* Racing stripe accent */}
      <div className="absolute inset-0 racing-stripe opacity-10 z-0"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 w-full">
        <div className="text-center animate-fade-in-up opacity-95">
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

                <div className="mt-4 flex justify-center">
                      <Link
                        href="/events/2026"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg transition-all bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-white/30 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
