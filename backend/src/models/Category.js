import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    icon: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Category', categorySchema);
