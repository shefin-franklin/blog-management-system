import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8).max(128),
  role: z.enum(['super_admin', 'admin', 'editor', 'author', 'subscriber']).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1),
});

export const blogSchema = z.object({
  title: z.string().trim().min(5).max(180),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional().or(z.literal('')),
  excerpt: z.string().trim().min(20).max(320).optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().or(z.literal('')),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'review', 'published', 'scheduled', 'archived']).optional(),
  publishedAt: z.coerce.date().optional(),
  scheduledAt: z.coerce.date().optional(),
  isFeatured: z.boolean().optional(),
  isSticky: z.boolean().optional(),
  seo: z
    .object({
      metaTitle: z.string().max(70).optional(),
      metaDescription: z.string().max(160).optional(),
      keywords: z.array(z.string()).optional(),
      canonicalUrl: z.string().url().optional().or(z.literal('')),
      ogImage: z.string().url().optional().or(z.literal('')),
      schema: z.record(z.unknown()).optional(),
    })
    .optional(),
});

export const aiSchema = z.object({
  feature: z.enum([
    'Generate article',
    'Continue writing',
    'Improve writing',
    'Rewrite paragraph',
    'Expand content',
    'Summarize content',
    'Grammar correction',
    'Tone changes',
    'SEO optimize',
    'Generate titles',
    'Generate descriptions',
    'Generate tags',
    'Generate FAQs',
    'Generate outlines',
    'moderation',
    'trend-detection',
    'analytics-insight',
  ]),
  prompt: z.string().min(1).max(12000),
});
