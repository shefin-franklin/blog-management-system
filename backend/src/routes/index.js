import { Router } from 'express';
import * as admin from '../controllers/admin.controller.js';
import * as ai from '../controllers/ai.controller.js';
import * as auth from '../controllers/auth.controller.js';
import * as blog from '../controllers/blog.controller.js';
import { upload, uploadImage } from '../controllers/upload.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/api.js';
import { aiSchema, blogSchema, loginSchema, registerSchema } from '../validators/schemas.js';

const router = Router();
const adminOnly = authorize('super_admin', 'admin');
const canWrite = authorize('super_admin', 'admin', 'editor', 'author');
const canModerate = authorize('super_admin', 'admin', 'editor');

router.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

router.post('/auth/register', validate(registerSchema), asyncHandler(auth.register));
router.post('/auth/login', validate(loginSchema), asyncHandler(auth.login));
router.post('/auth/refresh', asyncHandler(auth.refresh));
router.post('/auth/logout', asyncHandler(auth.logout));
router.get('/auth/me', protect, asyncHandler(auth.me));
router.patch('/auth/profile', protect, asyncHandler(auth.updateProfile));
router.patch('/auth/password', protect, asyncHandler(auth.changePassword));
router.post('/auth/forgot-password', asyncHandler(auth.forgotPassword));
router.post('/auth/verify-otp', asyncHandler(auth.verifyOtp));

router.get('/blogs', asyncHandler(blog.list));
router.get('/blogs/suggestions/personalized', protect, asyncHandler(blog.suggestions));
router.patch('/blogs/bulk/actions', protect, canModerate, asyncHandler(blog.bulk));
router.post('/blogs', protect, canWrite, validate(blogSchema), asyncHandler(blog.create));
router.patch('/blogs/:id', protect, validate(blogSchema.partial()), asyncHandler(blog.update));
router.delete('/blogs/:id', protect, canModerate, asyncHandler(blog.remove));
router.patch('/blogs/:id/restore', protect, adminOnly, asyncHandler(blog.restore));
router.post('/blogs/:id/like', protect, asyncHandler(blog.like));
router.post('/blogs/:id/bookmark', protect, asyncHandler(blog.bookmark));
router.get('/blogs/:slug', asyncHandler(blog.get));

router.post('/ai/generate', protect, validate(aiSchema), asyncHandler(ai.aiGenerate));
router.post('/ai/moderate', protect, asyncHandler(ai.aiModerate));
router.post('/media', protect, upload.single('file'), asyncHandler(uploadImage));

router.get('/admin/overview', protect, adminOnly, asyncHandler(admin.overview));
router.get('/admin/users', protect, adminOnly, asyncHandler(admin.users));
router.post('/admin/users', protect, authorize('super_admin'), asyncHandler(admin.upsertUser));
router.patch('/admin/users/:id', protect, authorize('super_admin'), asyncHandler(admin.upsertUser));
router.delete('/admin/users/:id', protect, authorize('super_admin'), asyncHandler(admin.deleteUser));

for (const [base, crud] of [
  ['categories', admin.categoryCrud],
  ['tags', admin.tagCrud],
  ['comments', admin.commentCrud],
]) {
  router.get(`/admin/${base}`, protect, adminOnly, asyncHandler(crud.list));
  router.post(`/admin/${base}`, protect, adminOnly, asyncHandler(crud.create));
  router.patch(`/admin/${base}/:id`, protect, adminOnly, asyncHandler(crud.update));
  router.delete(`/admin/${base}/:id`, protect, adminOnly, asyncHandler(crud.remove));
}

router
  .route('/admin/settings')
  .get(protect, authorize('super_admin'), asyncHandler(admin.settings))
  .post(protect, authorize('super_admin'), asyncHandler(admin.settings));

export default router;
