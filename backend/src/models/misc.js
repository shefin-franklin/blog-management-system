import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', index: true },
  },
  { timestamps: true },
);
bookmarkSchema.index({ user: 1, blog: 1 }, { unique: true });

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', index: true },
  },
  { timestamps: true },
);
likeSchema.index({ user: 1, blog: 1 }, { unique: true });

export const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
export const Like = mongoose.model('Like', likeSchema);

export const Revision = mongoose.model(
  'Revision',
  new mongoose.Schema(
    {
      blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', index: true },
      version: Number,
      title: String,
      content: String,
      editor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
  ),
);

export const Media = mongoose.model(
  'Media',
  new mongoose.Schema(
    {
      url: String,
      publicId: String,
      folder: String,
      type: String,
      size: Number,
      uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
  ),
);

export const Setting = mongoose.model(
  'Setting',
  new mongoose.Schema(
    {
      key: { type: String, unique: true },
      value: mongoose.Schema.Types.Mixed,
      group: String,
    },
    { timestamps: true },
  ),
);

export const AiLog = mongoose.model(
  'AiLog',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      feature: String,
      prompt: String,
      response: String,
      tokens: Number,
    },
    { timestamps: true },
  ),
);

export const Session = mongoose.model(
  'Session',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      refreshTokenHash: String,
      userAgent: String,
      ip: String,
      expiresAt: Date,
    },
    { timestamps: true },
  ),
);

export const Notification = mongoose.model(
  'Notification',
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      title: String,
      message: String,
      type: String,
      read: { type: Boolean, default: false },
    },
    { timestamps: true },
  ),
);

export const Analytics = mongoose.model(
  'Analytics',
  new mongoose.Schema(
    {
      blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      event: String,
      duration: Number,
      metadata: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true },
  ),
);
