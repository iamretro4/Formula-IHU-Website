'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ScrutineerApplicationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    experience: '',
    certifications: '',
    availability: '',
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            type: 'scrutineer',
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone || null,
            organization: formData.organization || null,
            position: formData.position || null,
            experience: formData.experience || null,
            expertise: formData.certifications || null, // Using expertise field for certifications
            availability: formData.availability || null,
            motivation: formData.motivation || null,
          },
        ]);

      if (error) {
        console.error('Error submitting application:', error);
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          organization: '',
          position: '',
          experience: '',
          certifications: '',
          availability: '',
          motivation: '',
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/join-us" className="text-[#0066FF] hover:text-[#0052CC] mb-4 inline-block font-bold">
          ← Back to Join Us
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Scrutineer</h1>
        <p className="text-lg text-gray-700 mb-8">
          Scrutineers ensure all vehicles meet safety and technical regulations. Your attention to detail keeps the competition safe and fair.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] bg-white text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] bg-white text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] bg-white text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] bg-white text-gray-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Organization/Company
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Technical/Engineering Experience *
            </label>
            <select
              id="experience"
              name="experience"
              required
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select...</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16+">16+ years</option>
            </select>
          </div>

          <div>
            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relevant Certifications or Qualifications
            </label>
            <textarea
              id="certifications"
              name="certifications"
              rows={3}
              value={formData.certifications}
              onChange={handleChange}
              placeholder="e.g., Safety certifications, Technical qualifications..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Availability for Event Dates *
            </label>
            <textarea
              id="availability"
              name="availability"
              required
              rows={3}
              value={formData.availability}
              onChange={handleChange}
              placeholder="Please indicate your availability for the event dates..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Why do you want to be a scrutineer? *
            </label>
            <textarea
              id="motivation"
              name="motivation"
              required
              rows={5}
              value={formData.motivation}
              onChange={handleChange}
              placeholder="Tell us about your motivation and what you hope to contribute..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-[#0066FF] text-white font-bold rounded-lg hover:bg-[#0052CC] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>

          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-800">
              Thank you! Your application has been submitted. We'll review it and get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
              There was an error submitting your application. Please try again or contact us directly.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

