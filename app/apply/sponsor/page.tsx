'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SponsorApplicationPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    sponsorshipTier: '',
    budget: '',
    objectives: '',
    benefits: '',
    additionalInfo: '',
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
      // Split contactName into first and last name if possible
      const nameParts = formData.contactName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { error } = await supabase
        .from('applications')
        .insert([
          {
            type: 'sponsor',
            first_name: firstName,
            last_name: lastName,
            email: formData.email,
            phone: formData.phone || null,
            organization: formData.companyName || null,
            additional_data: {
              website: formData.website || null,
              industry: formData.industry || null,
              sponsorshipTier: formData.sponsorshipTier || null,
              budget: formData.budget || null,
              objectives: formData.objectives || null,
              benefits: formData.benefits || null,
              additionalInfo: formData.additionalInfo || null,
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
              formType: 'sponsor',
              formData: {
                'Company Name': formData.companyName,
                'Contact Name': formData.contactName,
                'Email': formData.email,
                'Phone': formData.phone,
                'Website': formData.website,
                'Industry': formData.industry,
                'Sponsorship Tier': formData.sponsorshipTier,
                'Budget': formData.budget,
                'Objectives': formData.objectives,
                'Benefits': formData.benefits,
                'Additional Info': formData.additionalInfo,
              },
            }),
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't fail the form submission if email fails
        }

        setSubmitStatus('success');
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          industry: '',
          sponsorshipTier: '',
          budget: '',
          objectives: '',
          benefits: '',
          additionalInfo: '',
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
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link 
          href="/sponsors" 
          className="text-primary-blue hover:text-primary-blue-dark mb-6 inline-flex items-center gap-2 font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sponsors
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Sponsor</h1>
        <p className="text-lg text-gray-700 mb-12">
          Interested in sponsoring Formula IHU? We offer various sponsorship tiers with benefits including brand visibility, networking opportunities, and access to talented engineering students.
        </p>

        {/* Available Soon Banner */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-center">
          <p className="text-lg font-bold text-yellow-900">Available Soon</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 opacity-60 pointer-events-none">
          <div>
            <label htmlFor="companyName" className="block text-sm font-bold text-gray-900 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="contactName" className="block text-sm font-bold text-gray-900 mb-2">
              Contact Person Name *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-bold text-gray-900 mb-2">
              Company Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-bold text-gray-900 mb-2">
              Industry *
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              required
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., Automotive, Engineering, Technology..."
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="sponsorshipTier" className="block text-sm font-bold text-gray-900 mb-2">
              Preferred Sponsorship Tier *
            </label>
            <div className="relative">
              <select
                id="sponsorshipTier"
                name="sponsorshipTier"
                required
                value={formData.sponsorshipTier}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none appearance-none pr-10"
              >
                <option value="">Select...</option>
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
                <option value="partner">Partner</option>
                <option value="not-sure">Not Sure - Would like to discuss</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-bold text-gray-900 mb-2">
              Budget Range
            </label>
            <div className="relative">
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none appearance-none pr-10"
              >
                <option value="">Select...</option>
                <option value="under-5k">Under €5,000</option>
                <option value="5k-10k">€5,000 - €10,000</option>
                <option value="10k-25k">€10,000 - €25,000</option>
                <option value="25k-50k">€25,000 - €50,000</option>
                <option value="50k+">€50,000+</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="objectives" className="block text-sm font-bold text-gray-900 mb-2">
              Sponsorship Objectives *
            </label>
            <textarea
              id="objectives"
              name="objectives"
              required
              rows={4}
              value={formData.objectives}
              onChange={handleChange}
              placeholder="What are your main objectives for sponsoring Formula IHU? (e.g., Brand awareness, Talent recruitment, CSR initiatives...)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label htmlFor="benefits" className="block text-sm font-bold text-gray-900 mb-2">
              Desired Benefits
            </label>
            <textarea
              id="benefits"
              name="benefits"
              rows={4}
              value={formData.benefits}
              onChange={handleChange}
              placeholder="What specific benefits are you most interested in? (e.g., Logo placement, Speaking opportunities, Networking events...)"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue bg-white text-gray-900 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-gradient-primary text-white font-bold rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            Submit Application
          </button>

          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-800">
              Thank you! Your sponsorship application has been submitted. We&apos;ll review it and get back to you soon.
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

