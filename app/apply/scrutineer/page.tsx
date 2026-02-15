'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const AVAILABILITY_DAYS = ['1/8', '2/8', '3/8', '4/8', '5/8', '6/8', '7/8', '8/8'];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ScrutineerApplicationPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    organization: '',
    experience: '',
    availability: [] as string[],
    wasFormulaStudentMember: '',
    fsTeamName: '',
    fsRole: '',
    participatedAsScrutineerBefore: '',
    tshirtSize: '',
    dietaryRestrictions: '',
    accommodationPreference: '',
    additionalComments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxGroup = (name: string, value: string) => {
    setFormData((prev) => {
      const current = prev[name as keyof typeof prev] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [name]: updated };
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
            experience: formData.experience || null,
            availability: formData.availability.join(', ') || null,
            additional_data: {
              wasFormulaStudentMember: formData.wasFormulaStudentMember || null,
              fsTeamName: formData.fsTeamName || null,
              fsRole: formData.fsRole || null,
              participatedAsScrutineerBefore: formData.participatedAsScrutineerBefore || null,
              tshirtSize: formData.tshirtSize || null,
              dietaryRestrictions: formData.dietaryRestrictions || null,
              accommodationPreference: formData.accommodationPreference || null,
              additionalComments: formData.additionalComments || null,
            },
          },
        ]);

      if (error) {
        console.error('Error submitting application:', error);
        setSubmitStatus('error');
      } else {
        try {
          await fetch('/api/send-form-notification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formType: 'scrutineer',
              formData: {
                'Email': formData.email,
                'First Name': formData.firstName,
                'Last Name': formData.lastName,
                'Phone': formData.phone,
                'Organization/Company': formData.organization,
                'Years of Experience': formData.experience,
                'Availability': formData.availability.join(', '),
                'Was Formula Student Member': formData.wasFormulaStudentMember,
                'FS Team Name': formData.fsTeamName,
                'FS Role': formData.fsRole,
                'Participated as Scrutineer Before': formData.participatedAsScrutineerBefore,
                'T-Shirt Size': formData.tshirtSize,
                'Dietary Restrictions': formData.dietaryRestrictions,
                'Accommodation Preference': formData.accommodationPreference,
                'Additional Comments': formData.additionalComments,
              },
            }),
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
        }

        setSubmitStatus('success');
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          organization: '',
          experience: '',
          availability: [],
          wasFormulaStudentMember: '',
          fsTeamName: '',
          fsRole: '',
          participatedAsScrutineerBefore: '',
          tshirtSize: '',
          dietaryRestrictions: '',
          accommodationPreference: '',
          additionalComments: '',
        });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] bg-white text-gray-900 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/join-us" className="text-[#0066FF] hover:text-[#0052CC] mb-4 inline-block font-bold">
          &larr; Back to Join Us
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Scrutineer</h1>

        <div className="mb-8 text-gray-700 text-base leading-relaxed space-y-3">
          <p>
            Be part of a dynamic and hands-on engineering experience at the heart of the competition.
          </p>
          <p>
            Joining Formula IHU 2026 as a Scrutineer means taking on a crucial technical role that directly impacts the safety, fairness, and professionalism of the event. It is an opportunity to apply your expertise in vehicle inspection, collaborate with passionate teams, and ensure that every car meets the required technical and safety standards before entering the track.
          </p>
          <p>
            Scrutineers are fundamental to the smooth and safe operation of the event. Through detailed technical checks and constructive interaction with teams, you help uphold the integrity of the competition while contributing to an educational and high-level engineering environment.
          </p>
          <p>
            By completing this registration form, you are expressing your interest in serving as a Scrutineer at the second edition of Formula IHU.
          </p>
          <p>
            Please submit your application by <strong>May 31, 2026</strong>. Our team will contact you within two weeks of your submission to confirm your participation and provide further details regarding responsibilities, schedule, and next steps.
          </p>
          <p>
            If, for any serious reason, you are unable to participate after registering, please inform us as soon as possible at{' '}
            <a href="mailto:info.formulaihu@ihu.gr" className="text-[#0066FF] underline">info.formulaihu@ihu.gr</a>, so that we can make the necessary arrangements.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>Email *</label>
            <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} />
          </div>

          {/* Name & Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name *</label>
              <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name *</label>
              <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>Contact Tel. Number *</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Include country code" />
          </div>

          {/* Organization */}
          <div>
            <label htmlFor="organization" className={labelClass}>Organization/Company</label>
            <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} className={inputClass} />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className={labelClass}>Years of Technical/Engineering Experience *</label>
            <select id="experience" name="experience" required value={formData.experience} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16+">16+ years</option>
            </select>
          </div>

          {/* Availability Days */}
          <div>
            <p className={labelClass}>Availability (please select all that apply) *</p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {AVAILABILITY_DAYS.map((day) => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availability.includes(day)}
                    onChange={() => handleCheckboxGroup('availability', day)}
                    className="w-4 h-4 text-[#0066FF] border-gray-300 rounded focus:ring-[#0066FF]"
                  />
                  <span className="text-gray-700 text-sm">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Formula Student Member */}
          <div>
            <label htmlFor="wasFormulaStudentMember" className={labelClass}>Were you a member of a Formula Student team in the past? *</label>
            <select id="wasFormulaStudentMember" name="wasFormulaStudentMember" required value={formData.wasFormulaStudentMember} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {formData.wasFormulaStudentMember === 'Yes' && (
            <>
              <div>
                <label htmlFor="fsTeamName" className={labelClass}>If yes, what is the name of your FS team?</label>
                <input type="text" id="fsTeamName" name="fsTeamName" value={formData.fsTeamName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label htmlFor="fsRole" className={labelClass}>Which was your role?</label>
                <input type="text" id="fsRole" name="fsRole" value={formData.fsRole} onChange={handleChange} className={inputClass} />
              </div>
            </>
          )}

          {/* Participated Before */}
          <div>
            <label htmlFor="participatedAsScrutineerBefore" className={labelClass}>Have you ever participated in any other Formula Student event before as a scrutineer? *</label>
            <select id="participatedAsScrutineerBefore" name="participatedAsScrutineerBefore" required value={formData.participatedAsScrutineerBefore} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* T-Shirt Size */}
          <div>
            <label htmlFor="tshirtSize" className={labelClass}>Choose your T-shirt size *</label>
            <select id="tshirtSize" name="tshirtSize" required value={formData.tshirtSize} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              {TSHIRT_SIZES.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>

          {/* Dietary Restrictions */}
          <div>
            <label htmlFor="dietaryRestrictions" className={labelClass}>Do you have any food allergies or dietary restrictions?</label>
            <input type="text" id="dietaryRestrictions" name="dietaryRestrictions" value={formData.dietaryRestrictions} onChange={handleChange} className={inputClass} placeholder="e.g. Vegetarian, Vegan, Gluten-free, None" />
          </div>

          {/* Accommodation */}
          <div>
            <label htmlFor="accommodationPreference" className={labelClass}>Accommodation preference *</label>
            <select id="accommodationPreference" name="accommodationPreference" required value={formData.accommodationPreference} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="own">I will arrange my own accommodation</option>
              <option value="campsite">I would like to stay at the campsite</option>
              <option value="hotel">I would like to stay at a hotel</option>
            </select>
          </div>

          {/* Additional Comments */}
          <div>
            <label htmlFor="additionalComments" className={labelClass}>Would you like to add anything else?</label>
            <textarea id="additionalComments" name="additionalComments" rows={3} value={formData.additionalComments} onChange={handleChange} className={inputClass} />
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
              Thank you! Your application has been submitted. We&apos;ll review it and get back to you within two weeks.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
              There was an error submitting your application. Please try again or contact us directly at info.formulaihu@ihu.gr.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
