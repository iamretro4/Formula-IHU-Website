import { getEvents } from '@/lib/sanity.queries';
import ConditionalLayout from './conditional-layout';

export default async function ConditionalLayoutWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const events = await getEvents().catch(() => []);
  
  return <ConditionalLayout events={events}>{children}</ConditionalLayout>;
}


