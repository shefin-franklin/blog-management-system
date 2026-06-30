import slugify from 'slugify';
import { trendingScore, relatedScore, personalizedScore } from '../analytics/scoring.js';
import Blog from '../models/Blog.js';
import { Revision } from '../models/misc.js';

export async function uniqueSlug(title, manual) {
  const base = slugify(manual || title, { lower: true, strict: true });
  let slug = base;
  let counter = 1;

  while (await Blog.exists({ slug })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function saveRevision(blog, user) {
  await Revision.create({
    blog: blog._id,
    version: blog.version,
    title: blog.title,
    content: blog.content,
    editor: user._id,
  });
}

export async function recalcTrending(blog) {
  blog.stats.trendingScore = trendingScore(blog.stats, blog.publishedAt || blog.createdAt);
  return blog.save();
}

export async function relatedBlogs(blog) {
  const candidates = await Blog.find({ _id: { $ne: blog._id }, status: 'published' }).populate('tags categories').limit(100);

  return candidates
    .map((candidate) => ({ blog: candidate, score: relatedScore(blog, candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((entry) => entry.blog);
}

export async function personalizedBlogs(user) {
  const blogs = await Blog.find({ status: 'published' }).populate('tags categories').limit(100);

  return blogs
    .map((blog) => ({ blog, score: personalizedScore(user, blog) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((entry) => entry.blog);
}
