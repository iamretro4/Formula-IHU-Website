'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function VolunteerApplicationPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    availability: '',
    dietaryPreference: '',
    needsAccommodation: '',
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
    // Temporarily disabled
    return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            type: 'volunteer',
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone || null,
            availability: formData.availability || null,
            additional_data: {
              dietaryPreference: formData.dietaryPreference || null,
              needsAccommodation: formData.needsAccommodation || null,
            },
          },
        ]);

      if (error) {
        console.error('Error submitting application:', error);
        setSubmitStatus('error');
      } else {
        // Send email notification
        try {
          await fetch('/api/send-form-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              formType: 'volunteer',
              formData: {
                'First Name': formData.firstName,
                'Last Name': formData.lastName,
                'Email': formData.email,
                'Phone': formData.phone,
                'Availability': formData.availability,
                'Dietary Preference': formData.dietaryPreference,
                'Needs Accommodation': formData.needsAccommodation,
              },
            }),
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't fail the form submission if email fails
        }

        setSubmitStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          availability: '',
          dietaryPreference: '',
          needsAccommodation: '',
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
        <Link href="/join-us" className="text-primary-blue hover:text-primary-blue-dark mb-4 inline-block font-bold">
          ← Back to Join Us
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Volunteer</h1>
        <p className="text-lg text-gray-700 mb-8">
          Volunteers are essential to the smooth operation of the event. Help with logistics, registration, and event coordination.
        </p>

        {/* Available Soon Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
          <p className="text-lg font-bold text-yellow-900">Available Soon</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 opacity-60 pointer-events-none">
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
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="dietaryPreference" className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Preference *
            </label>
            <select
              id="dietaryPreference"
              name="dietaryPreference"
              required
              value={formData.dietaryPreference}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            >
              <option value="">Select...</option>
              <option value="no-restrictions">No Restrictions</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="needsAccommodation" className="block text-sm font-medium text-gray-700 mb-2">
              Do you need accommodation? *
            </label>
            <select
              id="needsAccommodation"
              name="needsAccommodation"
              required
              value={formData.needsAccommodation}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            >
              <option value="">Select...</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-primary-blue text-white font-bold rounded-lg hover:bg-primary-blue-dark transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            Submit Application
          </button>

          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-800">
              Thank you! Your application has been submitted. We&apos;ll review it and get back to you soon.
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
