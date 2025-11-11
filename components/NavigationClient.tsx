'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import Logo from './Logo';
import clsx from 'clsx';

interface NavigationClientProps {
  events: any[];
}

export default function NavigationClient({ events }: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/sponsors', label: 'Sponsors & Partners' },
    { href: '/join-us', label: 'Join us' },
    { href: '/contact', label: 'Contact us' },
    { href: '/rules', label: 'Rules & Documents' },
    { href: '/results', label: 'Results' },
    { href: '/team-portal', label: 'Team Portal' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const upcomingEvents = events.filter((e: any) => e.status === 'upcoming' || e.status === 'current');
  const pastEvents = events.filter((e: any) => e.status === 'past');

  return (
    <nav 
      className={clsx(
        'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300',
        isScrolled 
          ? 'shadow-lg border-gray-300' 
          : 'shadow-sm border-gray-200'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={clsx(
          'flex justify-between items-center transition-all duration-300',
          isScrolled ? 'h-14' : 'h-16'
        )}>
          <Link href="/" className="flex items-center">
            <Logo height={36} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors ${
                isActive('/') ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            
            {/* Events Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setEventsOpen(true)}
                onMouseLeave={() => setEventsOpen(false)}
                className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors flex items-center gap-1 ${
                  pathname?.startsWith('/events') ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                }`}
              >
                Events
                <ChevronDown className={clsx(
                  'h-4 w-4 transition-transform duration-200',
                  eventsOpen && 'rotate-180'
                )} />
              </button>
              {eventsOpen && (
                <div
                  onMouseEnter={() => setEventsOpen(true)}
                  onMouseLeave={() => setEventsOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border-2 border-gray-200 py-2 animate-fade-in-down"
                >
                  <Link
                    href="/events"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gradient-primary hover:text-white transition-all rounded-md mx-2"
                  >
                    All Events
                  </Link>
                  {upcomingEvents.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Upcoming
                      </div>
                      {upcomingEvents.map((event: any) => (
                        <Link
                          key={event._id}
                          href={`/events/${event.year}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-primary hover:text-white transition-all rounded-md mx-2"
                        >
                          {event.title} ({event.year})
                        </Link>
                      ))}
                    </>
                  )}
                  {pastEvents.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Past Events
                      </div>
                      {pastEvents.slice(0, 5).map((event: any) => (
                        <Link
                          key={event._id}
                          href={`/events/${event.year}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-primary hover:text-white transition-all rounded-md mx-2"
                        >
                          {event.title} ({event.year})
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors ${
                  isActive(item.href) ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary-blue hover:bg-gray-100 transition-all focus-ring"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-1">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors ${
                  isActive('/') ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <div>
                <button
                  onClick={() => setEventsOpen(!eventsOpen)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors flex items-center justify-between ${
                    pathname?.startsWith('/events') ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                  }`}
                >
                  Events
                  <ChevronDown className={clsx(
                    'h-4 w-4 transition-transform duration-200',
                    eventsOpen && 'rotate-180'
                  )} />
                </button>
                {eventsOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    <Link
                      href="/events"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-blue rounded-md hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      All Events
                    </Link>
                    {upcomingEvents.map((event: any) => (
                      <Link
                        key={event._id}
                        href={`/events/${event.year}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-blue rounded-md hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {event.title} ({event.year})
                      </Link>
                    ))}
                    {pastEvents.slice(0, 5).map((event: any) => (
                      <Link
                        key={event._id}
                        href={`/events/${event.year}`}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-blue rounded-md hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        {event.title} ({event.year})
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-blue rounded-md transition-colors ${
                    isActive(item.href) ? 'text-primary-blue bg-primary-blue/10' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
