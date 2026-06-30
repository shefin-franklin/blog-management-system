import { useQuery } from '@tanstack/react-query';
import { Card, Skeleton } from '../components/ui/Card';
import { api } from '../services/api';

export default function Admin() {
  const { data, isLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: () => api.get('/admin/overview').then((response) => response.data.data),
  });

  if (isLoading) return <Skeleton />;

  const stats = [
    ['Users', data.totals.users],
    ['Blogs', data.totals.blogs],
    ['Views', data.totals.views],
    ['Revenue Ready', `$${data.totals.revenue}`],
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">Command Center</h1>
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <p className="text-muted">{label}</p>
            <b className="text-3xl">{value}</b>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-xl font-bold">Trending Articles</h2>
          {data.trending.map((article) => (
            <p className="mt-3 text-muted" key={article._id}>
              {article.title} — {article.stats.trendingScore}
            </p>
          ))}
        </Card>
        <Card>
          <h2 className="text-xl font-bold">AI Insights</h2>
          {data.aiInsights.map((insight) => (
            <p className="mt-3 text-muted" key={insight}>
              {insight}
            </p>
          ))}
        </Card>
      </div>
    </div>
  );
}
