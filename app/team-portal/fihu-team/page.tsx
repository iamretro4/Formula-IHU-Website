'use client';

import { useState } from 'react';
import { Lock, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FIHUTeamPage() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin === '1926') {
      setIsAuthenticated(true);
      setPin('');
      setAttempts(0);
    } else {
      setError('Incorrect PIN. Please try again.');
      setAttempts(attempts + 1);
      setPin('');
      
      if (attempts >= 2) {
        setError('Too many incorrect attempts. Please try again later.');
      }
    }
  };

  if (isAuthenticated) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link 
            href="/team-portal" 
            className="text-primary-blue hover:text-primary-blue-dark mb-6 inline-flex items-center gap-2 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Team Portal
          </Link>

          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">FIHU Team Portal</h1>
            <p className="text-lg text-gray-600">
              Access FIHU internal resources and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <a
              href={process.env.NEXT_PUBLIC_HUB_URL || 'https://hub.fihu.gr'}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 card-hover text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <ExternalLink className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                  FIHU Hub
                </h3>
                <p className="text-gray-600 mb-4">
                  Access the FIHU Hub platform
                </p>
                <div className="flex items-center text-primary-blue font-semibold text-sm group-hover:gap-2 transition-all">
                  Open Hub
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>

            <a
              href={process.env.NEXT_PUBLIC_FLOW_URL || 'https://flow.fihu.gr'}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 card-hover text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <ExternalLink className="w-8 h-8 text-primary-blue" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                  FIHU Flow
                </h3>
                <p className="text-gray-600 mb-4">
                  Access the FIHU Flow platform
                </p>
                <div className="flex items-center text-primary-blue font-semibold text-sm group-hover:gap-2 transition-all">
                  Open Flow
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>

            <Link
              href="/registration-tests"
              className="group"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-blue hover:shadow-xl transition-all transform hover:-translate-y-2 card-hover text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-primary-blue/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-blue/20 transition-colors">
                  <svg className="w-8 h-8 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-blue transition-colors">
                  Registration Tests
                </h3>
                <p className="text-gray-600 mb-4">
                  Take the Formula IHU registration quiz
                </p>
                <div className="flex items-center text-primary-blue font-semibold text-sm group-hover:gap-2 transition-all">
                  Start Quiz
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link 
          href="/team-portal" 
          className="text-primary-blue hover:text-primary-blue-dark mb-6 inline-flex items-center gap-2 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Portal
        </Link>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              FIHU Team Access
            </h1>
            <p className="text-lg text-gray-600">
              Enter your PIN to access FIHU Team resources
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label htmlFor="pin" className="block text-sm font-bold text-gray-900 mb-2">
                Enter PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-racing-red">{error}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              <Lock className="w-5 h-5" />
              Unlock Access
            </Button>
          </form>

          {attempts > 0 && attempts < 3 && (
            <p className="mt-4 text-sm text-gray-500 text-center">
              Attempts remaining: {3 - attempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

