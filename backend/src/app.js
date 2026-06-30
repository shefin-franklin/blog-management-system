export async function createApp() {
  const [{ default: express }, { default: Blog }, { default: routes }, { env }, { errorHandler, notFound }, { security }] =
    await Promise.all([
      import('express'),
      import('./models/Blog.js'),
      import('./routes/index.js'),
      import('./config/env.js'),
      import('./middlewares/error.js'),
      import('./middlewares/security.js'),
    ]);

  const app = express();

  app.set('siteUrl', env.clientUrl);
  app.use(security);
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1', routes);

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml');
  });

  app.get('/sitemap.xml', async (req, res, next) => {
    try {
      const blogs = await Blog.find({ status: 'published' })
        .select('slug updatedAt')
        .sort('-updatedAt')
        .limit(50000);
      const urls = blogs
        .map(
          (blog) =>
            `<url><loc>${env.clientUrl}/blog/${blog.slug}</loc><lastmod>${blog.updatedAt.toISOString()}</lastmod></url>`,
        )
        .join('');

      res
        .type('application/xml')
        .send(
          `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${env.clientUrl}</loc></url>${urls}</urlset>`,
        );
    } catch (error) {
      next(error);
    }
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
