import { getEvents, getSiteSettings } from '@/lib/sanity.queries';
import FooterClient from './FooterClient';

export default async function Footer() {
  const events = await getEvents().catch(() => []);
  const siteSettings = await getSiteSettings().catch(() => null);
  const recentEvents = events.slice(0, 5);

  return <FooterClient events={recentEvents} siteSettings={siteSettings} />;
}
