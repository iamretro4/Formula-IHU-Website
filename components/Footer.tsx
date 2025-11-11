import Link from 'next/link';
import { getEvents } from '@/lib/sanity.queries';
import { Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export default async function Footer() {
  const events = await getEvents().catch(() => []);
  const recentEvents = events.slice(0, 5);

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-2 border-gray-800 relative overflow-hidden">
      {/* Racing stripe accent */}
      <div className="absolute inset-0 racing-stripe opacity-5"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Formula IHU</h3>
            <p className="text-sm mb-6 leading-relaxed">
              Formula IHU is the official Formula Student Competition held in Greece, part of Formula Student World Series.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-blue transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-blue transition-all transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  About
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Results
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
            <ul className="space-y-3 text-sm">
              {recentEvents.length > 0 ? (
                recentEvents.map((event: any) => (
                  <li key={event._id}>
                    <Link
                      href={`/events/${event.year}`}
                      className="hover:text-white hover:translate-x-1 inline-block transition-all"
                    >
                      {event.title} ({event.year})
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No events yet</li>
              )}
            </ul>
          </div>

          {/* Join Us & Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Join Us</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li>
                <Link href="/join-us" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Become a judge
                </Link>
              </li>
              <li>
                <Link href="/join-us" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Become a scrutineer
                </Link>
              </li>
              <li>
                <Link href="/join-us" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                  Become a volunteer
                </Link>
              </li>
            </ul>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-primary-blue" />
                <span>Thessaloniki, Greece</span>
              </li>
              <li>
                <a
                  href="mailto:info.formulaihu@ihu.gr"
                  className="flex items-center gap-2 hover:text-white transition-all group"
                >
                  <Mail className="w-4 h-4 text-primary-blue group-hover:translate-x-0.5 transition-transform" />
                  <span>info.formulaihu@ihu.gr</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:technical.formulaihu@ihu.gr"
                  className="flex items-center gap-2 hover:text-white transition-all group"
                >
                  <Mail className="w-4 h-4 text-primary-blue group-hover:translate-x-0.5 transition-transform" />
                  <span>technical.formulaihu@ihu.gr</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Formula IHU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
