import { getPageContent } from '@/lib/sanity.queries';
import ImageCarousel from '@/components/ImageCarousel';
import { generateMetadata as generateSEOMetadata, generateBreadcrumbStructuredData } from "@/lib/seo";
import Breadcrumbs from '@/components/Breadcrumbs';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export const metadata = generateSEOMetadata({
  title: "About",
  description: "Learn about Formula IHU, the official Formula Student Competition in Greece. Discover our mission, history, and commitment to engineering excellence.",
  url: "/about",
});

export default async function AboutPage() {
  const pageContent = await getPageContent('about').catch(() => null);

  // Images for carousels - distributed across the page
  const topCarouselImages: Array<{ url: string; alt: string }> = [
    { url: '/images/about/2025Event2.jpeg', alt: 'Formula IHU 2025 Event' },
  ];

  const carousel1Images: Array<{ url: string; alt: string }> = [
    { url: '/images/about/2025Event4.jpeg', alt: 'Formula IHU 2025 Event' },
  ];

  const carousel2Images: Array<{ url: string; alt: string }> = [
    { url: '/images/about/2025Event1.jpeg', alt: 'Formula IHU 2025 Event' },
  ];

  const carousel3Images: Array<{ url: string; alt: string }> = [
    { url: '/images/about/2025Event6.jpeg', alt: 'Formula IHU 2025 Event' },
  ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fihu.gr';
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: `${siteUrl}/` },
    { name: 'About', url: `${siteUrl}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <Breadcrumbs
              items={[
                { label: 'About' },
              ]}
              className="mb-6"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              {pageContent?.title || 'About Formula IHU'}
            </h1>

          {/* Photo Carousel at the top */}
          <div className="mb-12">
            <ImageCarousel
              images={topCarouselImages}
              autoPlay={true}
              interval={5000}
              height="h-64 md:h-96"
            />
          </div>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg mb-6">
              Formula IHU is the official Formula Student Competition held in Greece, 
              part of the Formula Student World Series.
            </p>
            <p className="text-base mb-6 text-gray-600 italic">
              Organized by International Hellenic University
            </p>

            {/* Photo Carousel after first paragraph */}
            <div className="my-12">
              <ImageCarousel
                images={carousel1Images}
                autoPlay={true}
                interval={5000}
                height="h-64 md:h-96"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
              What is Formula Student?
            </h2>
            <p className="mb-4">
              Formula Student is an international engineering competition where university 
              teams design, build, and race formula-style cars. It provides students with 
              real-world engineering experience and challenges them to apply their knowledge 
              in a competitive environment.
            </p>

            {/* Photo Carousel after second paragraph */}
            <div className="my-12">
              <ImageCarousel
                images={carousel2Images}
                autoPlay={true}
                interval={5000}
                height="h-64 md:h-96"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
              Our Mission
            </h2>
            <p className="mb-4">
              Formula IHU aims to promote engineering excellence, innovation, and teamwork 
              among students. We provide a platform for students to showcase their skills, 
              learn from industry professionals, and compete at an international level.
            </p>

            {/* Photo Carousel after third paragraph */}
            <div className="my-12">
              <ImageCarousel
                images={carousel3Images}
                autoPlay={true}
                interval={5000}
                height="h-64 md:h-96"
              />
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
              The Competition
            </h2>
            <p className="mb-4">
              Teams compete in various static and dynamic events, including design evaluation, 
              cost analysis, business presentation, acceleration, skid pad, autocross, and 
              endurance. The competition tests not only the technical capabilities of the 
              vehicles but also the business acumen and presentation skills of the teams.
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

