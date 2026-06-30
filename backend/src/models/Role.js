import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema(
  {
    resource: { type: String, required: true },
    actions: [{ type: String, required: true }],
  },
  { _id: false },
);

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['super_admin', 'admin', 'editor', 'author', 'subscriber'],
      required: true,
      unique: true,
    },
    label: { type: String, required: true },
    permissions: [permissionSchema],
    isSystem: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('Role', roleSchema);
