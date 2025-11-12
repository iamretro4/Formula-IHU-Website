import { getPageContent } from '@/lib/sanity.queries';

// Revalidate this page every 60 seconds (fallback if webhook fails)
export const revalidate = 60;

export default async function AboutPage() {
  const pageContent = await getPageContent('about').catch(() => null);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {pageContent?.title || 'About Formula IHU'}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="text-lg mb-6">
              Formula IHU is the official Formula Student Competition held in Greece, 
              part of the Formula Student World Series.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
              What is Formula Student?
            </h2>
            <p className="mb-4">
              Formula Student is an international engineering competition where university 
              teams design, build, and race formula-style cars. It provides students with 
              real-world engineering experience and challenges them to apply their knowledge 
              in a competitive environment.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">
              Our Mission
            </h2>
            <p className="mb-4">
              Formula IHU aims to promote engineering excellence, innovation, and teamwork 
              among students. We provide a platform for students to showcase their skills, 
              learn from industry professionals, and compete at an international level.
            </p>
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
  );
}

