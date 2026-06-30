import mongoose from 'mongoose';

const seoSchema = {
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  canonicalUrl: String,
  ogImage: String,
  seoScore: { type: Number, default: 0 },
  schema: mongoose.Schema.Types.Mixed,
};

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: 'text' },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: String,
    content: { type: String, required: true },
    contentText: { type: String, index: 'text' },
    coverImage: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag', index: true }],
    status: {
      type: String,
      enum: ['draft', 'review', 'published', 'scheduled', 'archived', 'deleted'],
      default: 'draft',
      index: true,
    },
    publishedAt: Date,
    scheduledAt: Date,
    isFeatured: { type: Boolean, default: false },
    isSticky: { type: Boolean, default: false },
    deletedAt: Date,
    version: { type: Number, default: 1 },
    seo: seoSchema,
    stats: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      readDuration: { type: Number, default: 0 },
      trendingScore: { type: Number, default: 0 },
    },
    ai: {
      qualityScore: Number,
      summary: String,
      embedding: [Number],
      insights: [String],
    },
  },
  { timestamps: true },
);

blogSchema.index({ title: 'text', contentText: 'text', excerpt: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });

export default mongoose.model('Blog', blogSchema);
