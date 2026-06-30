import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Card, Skeleton } from '../components/ui/Card';
import { api } from '../services/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => api.get(`/blogs/${slug}`).then((response) => response.data.data),
  });

  if (isLoading) return <Skeleton className="h-96" />;

  const blog = data.blog;

  return (
    <article className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <h1 className="text-4xl font-black">{blog.title}</h1>
        <p className="mt-2 text-muted">
          By {blog.author?.name} • {blog.stats.views} views
        </p>
        <div className="prose prose-invert mt-8 max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </Card>
      <aside className="space-y-4">
        <Card>
          <h3 className="font-bold">SEO</h3>
          <p className="text-muted">Score {blog.seo?.seoScore || 0}/100</p>
        </Card>
        <Card>
          <h3 className="font-bold">Related</h3>
          {data.related.map((article) => (
            <p className="mt-2 text-muted" key={article._id}>
              {article.title}
            </p>
          ))}
        </Card>
      </aside>
    </article>
  );
}
