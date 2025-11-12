'use client';

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Lock } from 'lucide-react';
import Button from '@/components/ui/Button';

const Studio = dynamic(
  () =>
    Promise.all([
      import('next-sanity/studio').then((mod) => mod.NextStudio),
      import('../../../sanity.config'),
    ]).then(([NextStudio, config]) => {
      return function StudioComponent() {
        return <NextStudio config={config.default} />;
      };
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function StudioPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);


  const checkAuth = async () => {
    try {
      const response = await fetch('/api/studio-auth');
      const data = await response.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Ignore errors, user not authenticated
    }
  };

  useEffect(() => {
    setIsClient(true);
    checkAuth();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setError(data.error || 'Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setPassword('');
    }
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Sanity Studio Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter the password to access the content management system
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter password"
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <div>
              <Button type="submit" className="w-full">
                Access Studio
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <Studio />;
}

