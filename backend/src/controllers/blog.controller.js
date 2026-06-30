import Blog from '../models/Blog.js';
import { Analytics, Bookmark, Like } from '../models/misc.js';
import { ApiError, pageParams, send } from '../utils/api.js';
import { calculateSeoScore, structuredArticleData } from '../utils/seo.js';
import {
  personalizedBlogs,
  recalcTrending,
  relatedBlogs,
  saveRevision,
  uniqueSlug,
} from '../services/blog.service.js';

function ownershipFilter(user) {
  if (['super_admin', 'admin', 'editor'].includes(user.role)) return {};
  return { author: user._id };
}

function normalizeBlogPayload(payload) {
  const contentText = String(payload.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const seo = payload.seo || {};

  return {
    ...payload,
    contentText,
    seo: {
      ...seo,
      seoScore: calculateSeoScore({ ...payload, contentText, seo }),
    },
  };
}

export async function list(req, res) {
  const { page, limit, sort } = pageParams(req);
  const query = { status: req.query.status || 'published' };

  if (req.query.search) query.$text = { $search: req.query.search };
  if (req.query.author) query.author = req.query.author;
  if (req.query.category) query.categories = req.query.category;
  if (req.query.tag) query.tags = req.query.tag;

  const [items, total] = await Promise.all([
    Blog.find(query)
      .populate('author', 'name avatar role')
      .populate('categories tags')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Blog.countDocuments(query),
  ]);

  send(res, { items, total, page, pages: Math.ceil(total / limit) });
}

export async function get(req, res) {
  const blog = await Blog.findOne({ slug: req.params.slug })
    .populate('author', 'name avatar bio')
    .populate('categories tags');

  if (!blog) throw new ApiError(404, 'Blog not found');

  blog.stats.views += 1;
  await recalcTrending(blog);
  await Analytics.create({ blog: blog._id, user: req.user?._id, event: 'view' });

  send(res, {
    blog,
    structuredData: structuredArticleData(blog, req.app.get('siteUrl')),
    related: await relatedBlogs(blog),
  });
}

export async function create(req, res) {
  const payload = normalizeBlogPayload(req.body);
  const blog = await Blog.create({
    ...payload,
    slug: await uniqueSlug(payload.title, payload.slug),
    author: req.user._id,
    publishedAt: payload.status === 'published' ? new Date() : payload.publishedAt,
  });

  send(res, { blog }, 201);
}

export async function update(req, res) {
  const blog = await Blog.findOne({ _id: req.params.id, ...ownershipFilter(req.user) });
  if (!blog) throw new ApiError(404, 'Blog not found or access denied');

  await saveRevision(blog, req.user);

  const payload = normalizeBlogPayload({ ...blog.toObject(), ...req.body });
  Object.assign(blog, payload, { version: blog.version + 1 });

  if (req.body.slug && req.body.slug !== blog.slug) {
    blog.slug = await uniqueSlug(blog.title, req.body.slug);
  }

  if (req.body.status === 'published' && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  await blog.save();
  send(res, { blog });
}

export async function remove(req, res) {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, ...ownershipFilter(req.user) },
    { status: 'deleted', deletedAt: new Date() },
    { new: true },
  );

  if (!blog) throw new ApiError(404, 'Blog not found or access denied');
  send(res, { blog });
}

export async function restore(req, res) {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { status: 'draft', $unset: { deletedAt: 1 } },
    { new: true },
  );

  if (!blog) throw new ApiError(404, 'Blog not found');
  send(res, { blog });
}

export async function bulk(req, res) {
  const allowed = ['status', 'isFeatured', 'isSticky', 'scheduledAt'];
  const update = Object.fromEntries(Object.entries(req.body.update || {}).filter(([key]) => allowed.includes(key)));

  await Blog.updateMany({ _id: { $in: req.body.ids || [] } }, { $set: update });
  send(res, { message: 'Bulk operation complete' });
}

export async function like(req, res) {
  const result = await Like.updateOne(
    { user: req.user._id, blog: req.params.id },
    { $setOnInsert: { user: req.user._id, blog: req.params.id } },
    { upsert: true },
  );

  if (result.upsertedCount) await Blog.findByIdAndUpdate(req.params.id, { $inc: { 'stats.likes': 1 } });
  send(res, { message: 'Liked' });
}

export async function bookmark(req, res) {
  await Bookmark.updateOne(
    { user: req.user._id, blog: req.params.id },
    { $setOnInsert: { user: req.user._id, blog: req.params.id } },
    { upsert: true },
  );

  send(res, { message: 'Bookmarked' });
}

export async function suggestions(req, res) {
  send(res, { items: await personalizedBlogs(req.user) });
}
