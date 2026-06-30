import Blog from '../models/Blog.js';
import Category from '../models/Category.js';
import Comment from '../models/Comment.js';
import Tag from '../models/Tag.js';
import User from '../models/User.js';
import { Analytics, Setting } from '../models/misc.js';
import { pageParams, send } from '../utils/api.js';

export async function overview(req, res) {
  const [users, blogs, views, trending, active] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Analytics.countDocuments({ event: 'view' }),
    Blog.find({ status: 'published' }).sort('-stats.trendingScore').limit(5),
    User.find().sort('-lastLoginAt').limit(5).select('name email role lastLoginAt'),
  ]);

  send(res, {
    totals: { users, blogs, views, revenue: 0 },
    trending,
    active,
    aiInsights: [
      'Publishing velocity and engagement are tracked in real time',
      'Use AI SEO assistant before publishing for higher discoverability',
    ],
  });
}

export async function users(req, res) {
  const { page, limit, sort } = pageParams(req);
  const query = req.query.search
    ? {
        $or: [{ name: new RegExp(req.query.search, 'i') }, { email: new RegExp(req.query.search, 'i') }],
      }
    : {};

  send(res, {
    items: await User.find(query).sort(sort).skip((page - 1) * limit).limit(limit),
    total: await User.countDocuments(query),
  });
}

export async function upsertUser(req, res) {
  const user = req.params.id ? await User.findByIdAndUpdate(req.params.id, req.body, { new: true }) : await User.create(req.body);
  send(res, { user }, req.params.id ? 200 : 201);
}

export async function deleteUser(req, res) {
  await User.findByIdAndDelete(req.params.id);
  send(res, { message: 'User deleted' });
}

export async function crudModel(Model) {
  return {
    list: async (req, res) => send(res, { items: await Model.find().sort('name') }),
    create: async (req, res) => send(res, { item: await Model.create(req.body) }, 201),
    update: async (req, res) => send(res, { item: await Model.findByIdAndUpdate(req.params.id, req.body, { new: true }) }),
    remove: async (req, res) => {
      await Model.findByIdAndDelete(req.params.id);
      send(res, { message: 'Deleted' });
    },
  };
}

export const categoryCrud = await crudModel(Category);
export const tagCrud = await crudModel(Tag);
export const commentCrud = await crudModel(Comment);

export async function settings(req, res) {
  if (req.method === 'GET') {
    send(res, { items: await Setting.find() });
    return;
  }

  const item = await Setting.findOneAndUpdate({ key: req.body.key }, req.body, { upsert: true, new: true });
  send(res, { item });
}
