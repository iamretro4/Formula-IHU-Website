import { getStatistics } from '@/lib/sanity.queries';
import StatisticsSectionClient from './StatisticsSectionClient';

export default async function StatisticsSection() {
  const statistics = await getStatistics().catch(() => []);

  return <StatisticsSectionClient statistics={statistics} />;
}

