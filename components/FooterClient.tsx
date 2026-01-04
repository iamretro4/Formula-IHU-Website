'use client';

import Link from 'next/link';
import { Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

interface FooterClientProps {
  events: any[];
  siteSettings?: any;
}

export default function FooterClient({ events, siteSettings }: FooterClientProps) {
  const recentEvents = events.slice(0, 5);
  
  // Get footer data from Sanity with fallbacks
  const footerDescription = siteSettings?.footer?.description || 
    'Formula IHU is the official Formula Student Competition held in Greece, part of Formula Student World Series.';
  
  const quickLinks = siteSettings?.footer?.quickLinks || [
    { label: 'About', url: '/about' },
    { label: 'Events', url: '/events' },
    { label: 'Sponsors', url: '/sponsors' },
    { label: 'Results', url: '/results' },
    { label: 'Contact', url: '/contact' },
  ];
  
  const joinUsLinks = siteSettings?.footer?.joinUsLinks || [
    { label: 'Become a judge', url: '/join-us' },
    { label: 'Become a scrutineer', url: '/join-us' },
    { label: 'Become a volunteer', url: '/join-us' },
  ];
  
  const socialLinks = siteSettings?.social || {
    instagram: 'https://www.instagram.com',
    linkedin: 'https://www.linkedin.com',
  };
  
  const contact = siteSettings?.contact || {
    address: 'Thessaloniki, Greece',
    email: 'info.formulaihu@ihu.gr',
    technicalEmail: 'technical.formulaihu@ihu.gr',
  };

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
              {footerDescription}
            </p>
            <div className="flex gap-4">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-blue transition-all transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-blue transition-all transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          {quickLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {quickLinks.map((link: any, index: number) => (
                  <li key={index}>
                    <Link 
                      href={link.url} 
                      className="hover:text-white hover:translate-x-1 inline-block transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
            {joinUsLinks.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-white mb-4">Join Us</h3>
                <ul className="space-y-3 text-sm mb-6">
                  {joinUsLinks.map((link: any, index: number) => (
                    <li key={index}>
                      <Link 
                        href={link.url} 
                        className="hover:text-white hover:translate-x-1 inline-block transition-all"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              {contact.address && (
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 text-primary-blue" />
                  <span>{contact.address}</span>
                </li>
              )}
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 hover:text-white transition-all group"
                  >
                    <Mail className="w-4 h-4 text-primary-blue group-hover:translate-x-0.5 transition-transform" />
                    <span>{contact.email}</span>
                  </a>
                </li>
              )}
              {contact.technicalEmail && (
                <li>
                  <a
                    href={`mailto:${contact.technicalEmail}`}
                    className="flex items-center gap-2 hover:text-white transition-all group"
                  >
                    <Mail className="w-4 h-4 text-primary-blue group-hover:translate-x-0.5 transition-transform" />
                    <span>{contact.technicalEmail}</span>
                  </a>
                </li>
              )}
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
