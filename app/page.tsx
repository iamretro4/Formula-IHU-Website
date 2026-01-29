import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import DocumentCard from '@/components/DocumentCard';
import StatisticsSection from '@/components/StatisticsSection';
import { getFeaturedNews, getDocuments, getHomePageContent, getEvents } from '@/lib/sanity.queries';
import Link from 'next/link';
import { ArrowRight, FileText, Users, Mail } from 'lucide-react';
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { generateStructuredData } from "@/lib/seo";

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export const metadata = generateSEOMetadata({
  title: "Home",
  description: "Formula IHU is the official Formula Student Competition held in Greece. Join us for an international competition where engineering meets real-world challenge.",
  url: "/",
});

export default async function Home() {
  // Fetch data from Sanity (will work once CMS is configured)
  // For now, these will return empty arrays if CMS is not set up
  const featuredNews = await getFeaturedNews().catch(() => []);
  const featuredDocs = await getDocuments().then(docs => 
    docs
      .filter((doc: any) => doc.isFeatured)
      .filter((doc: any) => doc.category !== 'handbook' && doc.category !== 'event-handbook')
      .slice(0, 3)
  ).catch(() => []);
  const homePageContent = await getHomePageContent().catch(() => null);
  
  // Get the next upcoming competition
  const allEvents = await getEvents().catch(() => []);
  const now = new Date();
  
  // Find the next upcoming event
  // Priority 1: Current/upcoming events that haven't ended yet
  // Priority 2: Any event that starts in the future (in case status wasn't updated)
  const nextEvent = (() => {
    // First, try to find current/upcoming events that haven't ended
    const activeEvents = allEvents
      .filter((event: any) => {
        if (!event.startDate || !event.endDate) return false;
        const endDate = new Date(event.endDate);
        return (event.status === 'current' || event.status === 'upcoming') && endDate >= now;
      })
      .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    if (activeEvents.length > 0) {
      return activeEvents[0];
    }
    
    // Fallback: find the next event by start date (even if status is past, in case status wasn't updated)
    const futureEvents = allEvents
      .filter((event: any) => {
        if (!event.startDate) return false;
        return new Date(event.startDate) > now;
      })
      .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return futureEvents[0] || null;
  })();
  
  // Format dates for display
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const endDay = end.toLocaleDateString('en-US', { day: 'numeric' });
    const year = start.getFullYear();
    
    // If same month, show "August 26 to 31"
    if (start.getMonth() === end.getMonth()) {
      return `${startMonth} to ${endDay}, ${year}`;
    }
    // Different months: "August 26 to September 5, 2025"
    return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} to ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${year}`;
  };
  
  // Get competition title and description
  const competitionTitle = nextEvent 
    ? nextEvent.title || `Formula IHU ${nextEvent.year}`
    : homePageContent?.competitionTitle || 'Formula IHU 2025';
  
  const competitionDescription = nextEvent
    ? `Formula IHU ${nextEvent.year} will take place from ${formatDateRange(nextEvent.startDate, nextEvent.endDate)} at ${nextEvent.venue || nextEvent.location || 'Serres Racing Circuit'}. University teams from around the world design, build and race formula-style cars in an international competition where engineering meets real-world challenge.`
    : homePageContent?.competitionDescription || 'Formula IHU 2025 will take place from August 26 to 31 at Serres Racing Circuit. University teams from around the world design, build and race formula-style cars in an international competition where engineering meets real-world challenge.';

  // Generate structured data for the next event
  const eventStructuredData = nextEvent ? generateStructuredData({
    type: 'Event',
    data: {
      name: competitionTitle,
      description: competitionDescription,
      startDate: nextEvent.startDate,
      endDate: nextEvent.endDate,
      locationName: nextEvent.venue || nextEvent.location || 'Serres Racing Circuit',
      addressLocality: 'Serres',
    },
  }) : null;

  return (
    <>
      {eventStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventStructuredData),
          }}
        />
      )}
      <div className="flex flex-col">
      {/* Refresh Banner */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mt-4 max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-red-900 text-center">
          ⚠️ Please refresh the page at 13:00 CET to access the quiz
        </p>
      </div>
      <Hero />
      
      {/* Competition Info Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              {competitionTitle}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
              {competitionDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Documents */}
      {featuredDocs.length > 0 ? (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 sm:mb-12 gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Featured Documents</h2>
                <p className="text-gray-600 text-sm sm:text-base">Important competition documents and resources</p>
              </div>
              <Link
                href="/rules"
                className="text-primary-blue hover:text-primary-blue-dark font-semibold text-base transition-all flex items-center gap-2 group"
              >
                View All
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredDocs.map((doc: any) => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Statistics Section */}
      <StatisticsSection />

      {/* News Section */}
      <NewsSection news={featuredNews.length > 0 ? featuredNews : []} />

      {/* Quick Links */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">{homePageContent?.quickLinksTitle || 'Quick Links'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link
              href="/about"
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
            >
              <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                <FileText className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">About</h3>
              <p className="text-gray-600 text-base">Learn about Formula IHU</p>
            </Link>
            <Link
              href="/sponsors"
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
            >
              <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                <Users className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">Sponsors</h3>
              <p className="text-gray-600 text-base">Our partners and sponsors</p>
            </Link>
            <Link
              href="/join-us"
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
            >
              <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                <Users className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">Join Us</h3>
              <p className="text-gray-600 text-base">Become a judge or volunteer</p>
            </Link>
            <Link
              href="/contact"
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 text-center group card-hover"
            >
              <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-blue/20 transition-colors">
                <Mail className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">Contact</h3>
              <p className="text-gray-600 text-base">Get in touch with us</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
