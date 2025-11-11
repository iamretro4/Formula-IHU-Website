import { getEvents } from '@/lib/sanity.queries';
import NavigationClient from './NavigationClient';

export default async function Navigation() {
  const events = await getEvents().catch(() => []);

  return <NavigationClient events={events} />;
}
