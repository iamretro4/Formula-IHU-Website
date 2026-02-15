'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const AVAILABILITY_DAYS = ['1/8', '2/8', '3/8', '4/8', '5/8', '6/8', '7/8', '8/8'];

const PREFERABLE_ROLES = [
  'Track Marshall',
  'Dynamic Events Support',
  'Technical Support',
  'Event Operations',
  'Media Team',
  'Registration / Welcome Desk',
];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function VolunteerApplicationPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    familyName: '',
    age: '',
    phone: '',
    country: '',
    universityDepartment: '',
    languagesSpoken: '',
    wasFormulaStudentMember: '',
    previousVolunteerExperience: '',
    availability: [] as string[],
    preferableRoles: [] as string[],
    whyVolunteer: '',
    driversLicense: '',
    firstAidKnowledge: '',
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
            type: 'volunteer',
            first_name: formData.firstName,
            last_name: formData.familyName,
            email: formData.email,
            phone: formData.phone || null,
            availability: formData.availability.join(', ') || null,
            additional_data: {
              age: formData.age || null,
              country: formData.country || null,
              universityDepartment: formData.universityDepartment || null,
              languagesSpoken: formData.languagesSpoken || null,
              wasFormulaStudentMember: formData.wasFormulaStudentMember || null,
              previousVolunteerExperience: formData.previousVolunteerExperience || null,
              preferableRoles: formData.preferableRoles,
              whyVolunteer: formData.whyVolunteer || null,
              driversLicense: formData.driversLicense || null,
              firstAidKnowledge: formData.firstAidKnowledge || null,
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
              formType: 'volunteer',
              formData: {
                'Email': formData.email,
                'First Name': formData.firstName,
                'Family Name': formData.familyName,
                'Age': formData.age,
                'Phone': formData.phone,
                'Country': formData.country,
                'University / Department': formData.universityDepartment,
                'Languages Spoken': formData.languagesSpoken,
                'Was Formula Student Member': formData.wasFormulaStudentMember,
                'Previous Volunteer Experience': formData.previousVolunteerExperience,
                'Availability': formData.availability.join(', '),
                'Preferable Roles': formData.preferableRoles.join(', '),
                'Why Volunteer': formData.whyVolunteer,
                'Driver\'s License': formData.driversLicense,
                'First Aid Knowledge': formData.firstAidKnowledge,
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
          familyName: '',
          age: '',
          phone: '',
          country: '',
          universityDepartment: '',
          languagesSpoken: '',
          wasFormulaStudentMember: '',
          previousVolunteerExperience: '',
          availability: [],
          preferableRoles: [],
          whyVolunteer: '',
          driversLicense: '',
          firstAidKnowledge: '',
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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Volunteer</h1>

        <div className="mb-8 text-gray-700 text-base leading-relaxed space-y-3">
          <p>
            Be part of an unforgettable experience that combines innovation, teamwork, and pure excitement!
          </p>
          <p>
            Joining Formula IHU 2026 as a volunteer is more than simply supporting an event — it is an opportunity to expand your knowledge, connect with talented individuals from around the world, and experience the energy of an international engineering competition up close.
          </p>
          <p>
            Our volunteers play a vital and impactful role in the overall success of the event, serving as the backbone of the entire organization.
          </p>
          <p>
            By completing this registration form, you are expressing your interest in volunteering at the second edition of Formula IHU.
          </p>
          <p>
            Please submit your application by <strong>May 31, 2026</strong>. Our team will contact you within two weeks of your submission to confirm your participation and provide further details regarding the next steps.
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

          {/* First Name & Family Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name *</label>
              <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="familyName" className={labelClass}>Family Name *</label>
              <input type="text" id="familyName" name="familyName" required value={formData.familyName} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className={labelClass}>Age *</label>
            <input type="number" id="age" name="age" required min="16" max="99" value={formData.age} onChange={handleChange} className={inputClass} />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number (include country code) *</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="e.g. +30 6912345678" />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className={labelClass}>Country *</label>
            <input type="text" id="country" name="country" required value={formData.country} onChange={handleChange} className={inputClass} />
          </div>

          {/* University / Department */}
          <div>
            <label htmlFor="universityDepartment" className={labelClass}>University / Department *</label>
            <input type="text" id="universityDepartment" name="universityDepartment" required value={formData.universityDepartment} onChange={handleChange} className={inputClass} />
          </div>

          {/* Languages Spoken */}
          <div>
            <label htmlFor="languagesSpoken" className={labelClass}>Languages Spoken *</label>
            <input type="text" id="languagesSpoken" name="languagesSpoken" required value={formData.languagesSpoken} onChange={handleChange} className={inputClass} placeholder="e.g. English, Greek, German" />
          </div>

          {/* Formula Student Member */}
          <div>
            <label htmlFor="wasFormulaStudentMember" className={labelClass}>Have you previously been a member of a Formula Student team? *</label>
            <select id="wasFormulaStudentMember" name="wasFormulaStudentMember" required value={formData.wasFormulaStudentMember} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Previous Volunteer Experience */}
          <div>
            <label htmlFor="previousVolunteerExperience" className={labelClass}>Have you previously volunteered at any competitions or motorsport events? *</label>
            <select id="previousVolunteerExperience" name="previousVolunteerExperience" required value={formData.previousVolunteerExperience} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
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

          {/* Preferable Roles (multi-select checkboxes) */}
          <div>
            <p className={labelClass}>Preferable Role(s) * <span className="text-gray-500 text-xs">(Select all that apply)</span></p>
            <div className="space-y-2">
              {PREFERABLE_ROLES.map((role) => (
                <label key={role} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferableRoles.includes(role)}
                    onChange={() => handleCheckboxGroup('preferableRoles', role)}
                    className="w-4 h-4 text-[#0066FF] border-gray-300 rounded focus:ring-[#0066FF]"
                  />
                  <span className="text-gray-700">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Why Volunteer */}
          <div>
            <label htmlFor="whyVolunteer" className={labelClass}>Why do you want to be a volunteer at Formula IHU 2026? *</label>
            <textarea id="whyVolunteer" name="whyVolunteer" required rows={4} value={formData.whyVolunteer} onChange={handleChange} className={inputClass} />
          </div>

          {/* Driver's License */}
          <div>
            <label htmlFor="driversLicense" className={labelClass}>Do you have a valid driver&apos;s license? *</label>
            <select id="driversLicense" name="driversLicense" required value={formData.driversLicense} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* First Aid */}
          <div>
            <label htmlFor="firstAidKnowledge" className={labelClass}>Do you have first aid knowledge or certification? *</label>
            <select id="firstAidKnowledge" name="firstAidKnowledge" required value={formData.firstAidKnowledge} onChange={handleChange} className={inputClass}>
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
