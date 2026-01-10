import { getEvents, getSiteSettings } from '@/lib/sanity.queries';
import ConditionalLayout from './conditional-layout';

export default async function ConditionalLayoutWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [events, siteSettings] = await Promise.all([
    getEvents().catch(() => []),
    getSiteSettings().catch(() => null)
  ]);
  
  return <ConditionalLayout events={events} siteSettings={siteSettings}>{children}</ConditionalLayout>;
}


