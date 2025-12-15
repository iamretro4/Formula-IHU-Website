import Hero from '@/components/Hero';
import NewsSection from '@/components/NewsSection';
import DocumentCard from '@/components/DocumentCard';
import StatisticsSection from '@/components/StatisticsSection';
import { getFeaturedNews, getDocuments, getHomePageContent } from '@/lib/sanity.queries';
import Link from 'next/link';
import { ArrowRight, FileText, Users, Mail } from 'lucide-react';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function Home() {
  // Fetch data from Sanity (will work once CMS is configured)
  // For now, these will return empty arrays if CMS is not set up
  const featuredNews = await getFeaturedNews().catch(() => []);
  const featuredDocs = await getDocuments().then(docs => 
    docs.filter((doc: any) => doc.isFeatured).slice(0, 3)
  ).catch(() => []);
  const homePageContent = await getHomePageContent().catch(() => null);

  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Competition Info Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {homePageContent?.competitionTitle || 'Formula IHU 2025'}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {homePageContent?.competitionDescription || 'Formula IHU 2025 will take place from August 26 to 31 at Serres Racing Circuit. University teams from around the world design, build and race formula-style cars in an international competition where engineering meets real-world challenge.'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Documents */}
      {featuredDocs.length > 0 ? (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Documents</h2>
                <p className="text-gray-600">Important competition documents and resources</p>
              </div>
              <Link
                href="/rules"
                className="text-primary-blue hover:text-primary-blue-dark font-semibold text-base transition-all flex items-center gap-2 group"
              >
                View All
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">{homePageContent?.quickLinksTitle || 'Quick Links'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
}
