import { getSponsors } from '@/lib/sanity.queries';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Sponsors",
  description: "Meet our partners and sponsors who make Formula IHU possible. Join us in supporting the next generation of engineers.",
  url: "/sponsors",
});

const tierOrder = ['title-partner', 'premium-partner', 'gold-partner', 'silver-partner', 'bronze-partner', 'supporter'];
const tierLabels: Record<string, string> = {
  'title-partner': 'Title Partner',
  'premium-partner': 'Premium Partner',
  'gold-partner': 'Gold Partner',
  'silver-partner': 'Silver Partner',
  'bronze-partner': 'Bronze Partner',
  'supporter': 'Supporter',
  'platinum': 'Organized By', // Handle legacy tier
};

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function SponsorsPage() {
  const sponsors = await getSponsors().catch(() => []);

  // Group sponsors by tier
  const sponsorsByTier = tierOrder.reduce((acc, tier) => {
    acc[tier] = sponsors.filter((s: any) => s.tier === tier);
    return acc;
  }, {} as Record<string, any[]>);
  
  // Handle legacy "platinum" tier (Organized By)
  const organizedBy = sponsors.filter((s: any) => s.tier === 'platinum');
  if (organizedBy.length > 0) {
    sponsorsByTier['platinum'] = organizedBy;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sponsors & Partners</h1>
        <p className="text-lg text-gray-600 mb-12">
          We are grateful to our sponsors and partners who make Formula IHU possible.
        </p>

        {sponsors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Sponsor information will be available soon.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Show Organized By first if exists */}
            {sponsorsByTier['platinum'] && sponsorsByTier['platinum'].length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-8 border-b border-gray-200 pb-2">
                  Organized By
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {sponsorsByTier['platinum'].map((sponsor: any) => (
                    <div
                      key={sponsor._id}
                      className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                    >
                      {sponsor.logo ? (
                        <a
                          href={sponsor.website || '#'}
                          target={sponsor.website ? '_blank' : undefined}
                          rel={sponsor.website ? 'noopener noreferrer' : undefined}
                          className="w-full h-32 flex items-center justify-center"
                        >
                          <Image
                            src={urlFor(sponsor.logo).width(200).height(120).url()}
                            alt={sponsor.name}
                            width={200}
                            height={120}
                            className="object-contain max-h-32"
                          />
                        </a>
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center text-gray-400">
                          {sponsor.name}
                        </div>
                      )}
                      {sponsor.name && (
                        <p className="mt-4 text-sm font-medium text-gray-700 text-center">
                          {sponsor.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tierOrder.map((tier) => {
              const tierSponsors = sponsorsByTier[tier];
              if (!tierSponsors || tierSponsors.length === 0) return null;

              return (
                <div key={tier}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-8 border-b border-gray-200 pb-2">
                    {tierLabels[tier]}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {tierSponsors.map((sponsor: any) => (
                      <div
                        key={sponsor._id}
                        className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                      >
                        {sponsor.logo ? (
                          <a
                            href={sponsor.website || '#'}
                            target={sponsor.website ? '_blank' : undefined}
                            rel={sponsor.website ? 'noopener noreferrer' : undefined}
                            className="w-full h-32 flex items-center justify-center"
                          >
                            <Image
                              src={urlFor(sponsor.logo).width(200).height(120).url()}
                              alt={sponsor.name}
                              width={200}
                              height={120}
                              className="object-contain max-h-32"
                            />
                          </a>
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center text-gray-400">
                            {sponsor.name}
                          </div>
                        )}
                        {sponsor.name && (
                          <p className="mt-4 text-sm font-medium text-gray-700 text-center">
                            {sponsor.name}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 p-8 bg-gray-50 rounded-lg hover:shadow-md transition-all">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Become a Sponsor</h2>
          <p className="text-gray-600 mb-6">
            Interested in sponsoring Formula IHU? We offer various sponsorship tiers with 
            benefits including brand visibility, networking opportunities, and access to 
            talented engineering students.
          </p>
          <Link
            href="/apply/sponsor"
            className="inline-block px-6 py-3 bg-[#0066FF] text-white font-bold rounded-lg hover:bg-[#0052CC] transition-all transform hover:scale-105 shadow-lg"
          >
            Become a Sponsor
          </Link>
        </div>
      </div>
    </div>
  );
}

