'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const JUDGING_AREAS = [
  'Cost & Manufacturing',
  'Business Plan',
  'Overall Vehicle Concept & Team Management',
  'Suspension & Vehicle Dynamics',
  'Aerodynamics',
  'Chassis, Ergonomics & Structural Design',
  'Powertrain & Tractive System',
  'Electronic Systems (LV/HV/HW/SW/Compute)',
];

const STATIC_EVENTS = [
  'Business Plan Presentation',
  'Cost & Manufacturing',
  'Engineering Design',
];

const AVAILABILITY_DAYS = ['1/8', '2/8', '3/8', '4/8', '5/8', '6/8', '7/8', '8/8'];

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function JudgeApplicationPage() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    staticEvents: [] as string[],
    availability: [] as string[],
    judgingArea1: '',
    judgingArea2: '',
    judgingArea3: '',
    status: '',
    currentRole: '',
    wasFormulaStudentMember: '',
    fsTeamName: '',
    fsRole: '',
    educationalStatus: '',
    participatedAsJudgeBefore: '',
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
            type: 'judge',
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone || null,
            organization: formData.status || null,
            experience: null,
            availability: formData.availability.join(', ') || null,
            additional_data: {
              staticEvents: formData.staticEvents,
              judgingArea1: formData.judgingArea1 || null,
              judgingArea2: formData.judgingArea2 || null,
              judgingArea3: formData.judgingArea3 || null,
              status: formData.status || null,
              currentRole: formData.currentRole || null,
              wasFormulaStudentMember: formData.wasFormulaStudentMember || null,
              fsTeamName: formData.fsTeamName || null,
              fsRole: formData.fsRole || null,
              educationalStatus: formData.educationalStatus || null,
              participatedAsJudgeBefore: formData.participatedAsJudgeBefore || null,
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
              formType: 'judge',
              formData: {
                'Email': formData.email,
                'First Name': formData.firstName,
                'Last Name': formData.lastName,
                'Phone': formData.phone,
                'Static Events': formData.staticEvents.join(', '),
                'Availability': formData.availability.join(', '),
                'Judging Area Preference #1': formData.judgingArea1,
                'Judging Area Preference #2': formData.judgingArea2,
                'Judging Area Preference #3': formData.judgingArea3,
                'Status (Company or University)': formData.status,
                'Current Role / Expertise': formData.currentRole,
                'Was Formula Student Member': formData.wasFormulaStudentMember,
                'FS Team Name': formData.fsTeamName,
                'FS Role': formData.fsRole,
                'Educational Status': formData.educationalStatus,
                'Participated as Judge Before': formData.participatedAsJudgeBefore,
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
          staticEvents: [],
          availability: [],
          judgingArea1: '',
          judgingArea2: '',
          judgingArea3: '',
          status: '',
          currentRole: '',
          wasFormulaStudentMember: '',
          fsTeamName: '',
          fsRole: '',
          educationalStatus: '',
          participatedAsJudgeBefore: '',
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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Become a Judge</h1>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <p className="font-semibold mb-1">Event Dates</p>
          <p>Business Plan Presentation: August -, 2026</p>
          <p>Cost &amp; Manufacturing: August -, 2026</p>
          <p>Engineering Design: August -, 2026</p>
        </div>

        <div className="mb-8 text-gray-700 text-base leading-relaxed space-y-3">
          <p>
            Be part of an inspiring and high-level engineering experience that celebrates innovation, excellence, and collaboration.
          </p>
          <p>
            Joining Formula IHU 2026 as a Judge is more than simply participating in a competition — it is an opportunity to evaluate and mentor talented student teams, contribute your expertise to the next generation of engineers, and play a decisive role in upholding the standards and integrity of the event.
          </p>
          <p>
            Our Judges hold a key position within the competition, ensuring fair evaluations, providing constructive feedback, and maintaining the overall quality of the judging process. Your insight and professional perspective are essential to the success and credibility of the event.
          </p>
          <p>
            By completing this registration form, you are expressing your interest in serving as a Judge for the Static Events at the second edition of Formula IHU.
          </p>
          <p>
            Please submit your application by <strong>May 31, 2026</strong>. Our team will contact you within two weeks of your submission to confirm your participation and provide further information regarding judging categories, scheduling, and next steps.
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
              <label htmlFor="firstName" className={labelClass}>Name *</label>
              <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Surname *</label>
              <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>Contact Tel. Number *</label>
            <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Include country code" />
          </div>

          {/* Static Events (multi-select checkboxes) */}
          <div>
            <p className={labelClass}>Which static event(s) are you interested in judging? * <span className="text-gray-500 text-xs">(Multiple choices possible)</span></p>
            <div className="space-y-2">
              {STATIC_EVENTS.map((event) => (
                <label key={event} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.staticEvents.includes(event)}
                    onChange={() => handleCheckboxGroup('staticEvents', event)}
                    className="w-4 h-4 text-[#0066FF] border-gray-300 rounded focus:ring-[#0066FF]"
                  />
                  <span className="text-gray-700">{event}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Days */}
          <div>
            <p className={labelClass}>When are you available? (Days of the competition) *</p>
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

          {/* Judging Area Preferences */}
          <div>
            <label htmlFor="judgingArea1" className={labelClass}>Which judging area do you prefer as your option No1? *</label>
            <select id="judgingArea1" name="judgingArea1" required value={formData.judgingArea1} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              {JUDGING_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="judgingArea2" className={labelClass}>Which judging area do you prefer as your option No2?</label>
            <select id="judgingArea2" name="judgingArea2" value={formData.judgingArea2} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              {JUDGING_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="judgingArea3" className={labelClass}>Which judging area do you prefer as your option No3?</label>
            <select id="judgingArea3" name="judgingArea3" value={formData.judgingArea3} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              {JUDGING_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>Your Status (company or university) *</label>
            <input type="text" id="status" name="status" required value={formData.status} onChange={handleChange} className={inputClass} />
          </div>

          {/* Current Role */}
          <div>
            <label htmlFor="currentRole" className={labelClass}>What is your current role or any past roles to describe your expertise? *</label>
            <textarea id="currentRole" name="currentRole" required rows={3} value={formData.currentRole} onChange={handleChange} className={inputClass} />
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

          {/* Educational Status */}
          <div>
            <label htmlFor="educationalStatus" className={labelClass}>What is your current educational status and highest level of education attained? *</label>
            <textarea id="educationalStatus" name="educationalStatus" required rows={2} value={formData.educationalStatus} onChange={handleChange} className={inputClass} />
          </div>

          {/* Participated Before */}
          <div>
            <label htmlFor="participatedAsJudgeBefore" className={labelClass}>Have you ever participated in any other Formula Student event before as a judge? *</label>
            <select id="participatedAsJudgeBefore" name="participatedAsJudgeBefore" required value={formData.participatedAsJudgeBefore} onChange={handleChange} className={inputClass}>
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
