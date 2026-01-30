'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap, Flame, ChevronDown, Trophy, Clock, FileDown } from 'lucide-react';
import clsx from 'clsx';
import type { RegistrationCategoryResults, RegistrationResultRow, RegistrationSection } from '@/lib/registration-results';

type RegistrationQuizResultsProps = {
  ev: RegistrationCategoryResults;
  cv: RegistrationCategoryResults;
  eventYear?: number;
  eventHref?: string | null;
  compact?: boolean;
};

function SectionTable({
  section,
  compact,
}: {
  section: RegistrationSection;
  compact?: boolean;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary-blue" />
        {section.title}
      </h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Team</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Score</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Time (h:mm)</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, idx) => (
              <tr
                key={`${row.teamName}-${idx}`}
                className={clsx(
                  'border-b border-gray-100 last:border-0 transition-colors',
                  idx < 3 && 'bg-primary-blue/5',
                  idx === 0 && 'bg-amber-50/80',
                  idx === 1 && 'bg-slate-50',
                  idx === 2 && 'bg-orange-50/60'
                )}
              >
                <td className="py-3 px-4 font-medium text-gray-900">{row.teamName}</td>
                <td className="py-3 px-4 text-right font-semibold text-primary-blue">
                  {typeof row.score === 'number' ? row.score : row.score}
                </td>
                <td className="py-3 px-4 text-right text-gray-600 flex items-center justify-end gap-1">
                  {row.time && (
                    <>
                      <Clock className="w-4 h-4 text-gray-400" aria-hidden />
                      {row.time}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryPanel({
  data,
  icon: Icon,
  accentColor,
  compact,
}: {
  data: RegistrationCategoryResults;
  icon: React.ElementType;
  accentColor: string;
  compact?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={clsx('p-2 rounded-xl', accentColor)}>
          <Icon className="w-6 h-6 text-white" aria-hidden />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{data.title}</h2>
          <p className="text-sm text-gray-600">{data.subtitle}</p>
        </div>
      </div>
      {data.sections.map((section) => (
        <SectionTable key={section.title} section={section} compact={compact} />
      ))}
    </div>
  );
}

export default function RegistrationQuizResults({
  ev,
  cv,
  eventYear = 2026,
  eventHref,
  compact = false,
}: RegistrationQuizResultsProps) {
  const [activeTab, setActiveTab] = useState<'ev' | 'cv'>('ev');
  const href = eventHref ?? `/events/${eventYear}#registration-results`;

  return (
    <section
      id="registration-results"
      className="scroll-mt-8 py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200/80"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-8 h-8 text-amber-500" aria-hidden />
              Registration Quiz Results
            </h2>
            <p className="text-gray-600 mt-1">
              Teams accepted for Formula IHU {eventYear} based on the registration quiz.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="/api/registration-results/pdf"
              download="fihu-2026-registration-results.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-blue text-white font-semibold hover:bg-primary-blue-dark transition-colors shadow-sm"
            >
              <FileDown className="w-5 h-5" aria-hidden />
              Download PDF
            </a>
            {eventHref !== null && (
              <Link
                href={href}
                className="inline-flex items-center gap-2 text-primary-blue font-semibold hover:text-primary-blue-dark transition-colors"
              >
                View full event
                <ChevronDown className="w-4 h-4 rotate-[270deg]" aria-hidden />
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('ev')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg border-b-2 -mb-px transition-colors',
              activeTab === 'ev'
                ? 'border-primary-blue text-primary-blue bg-primary-blue/5'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Zap className="w-5 h-5" aria-hidden />
            Electric (EV)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cv')}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 font-semibold rounded-t-lg border-b-2 -mb-px transition-colors',
              activeTab === 'cv'
                ? 'border-primary-blue text-primary-blue bg-primary-blue/5'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            <Flame className="w-5 h-5" aria-hidden />
            Combustion (CV)
          </button>
        </div>

        <div className="min-h-[200px]">
          {activeTab === 'ev' && (
            <CategoryPanel
              data={ev}
              icon={Zap}
              accentColor="bg-emerald-600"
              compact={compact}
            />
          )}
          {activeTab === 'cv' && (
            <CategoryPanel
              data={cv}
              icon={Flame}
              accentColor="bg-orange-600"
              compact={compact}
            />
          )}
        </div>
      </div>
    </section>
  );
}
