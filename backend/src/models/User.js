import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'editor', 'author', 'subscriber'],
      default: 'subscriber',
      index: true,
    },
    avatar: String,
    bio: String,
    status: { type: String, enum: ['active', 'blocked', 'pending'], default: 'active' },
    isEmailVerified: { type: Boolean, default: false },
    emailOtp: String,
    emailOtpExpires: Date,
    passwordResetOtp: String,
    passwordResetExpires: Date,
    interests: [String],
    followingAuthors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    socialProviders: [{ provider: String, providerId: String }],
    lastLoginAt: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
