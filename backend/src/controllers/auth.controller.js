import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { Session } from '../models/misc.js';
import { createSession, hash, signAccess } from '../services/token.service.js';
import { ApiError, send } from '../utils/api.js';

function setAuthCookies(res, accessToken, refreshToken) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
  };

  res.cookie('accessToken', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, cookieOptions);
}

export async function register(req, res) {
  const user = await User.create(req.body);
  const tokens = await createSession(user, req);

  setAuthCookies(res, tokens.access, tokens.refresh);
  send(res, { user, accessToken: tokens.access }, 201);
}

export async function login(req, res) {
  const user = await User.findOne({ email: req.body.email }).select('+password');

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const tokens = await createSession(user, req);
  setAuthCookies(res, tokens.access, tokens.refresh);
  send(res, { user, accessToken: tokens.access });
}

export async function refresh(req, res) {
  const token = req.cookies.refreshToken || req.body.refreshToken;

  if (!token) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(401).json({ success: false, message: 'Refresh token required' });
    return;
  }

  const decoded = jwt.verify(token, env.jwtRefreshSecret);
  const session = await Session.findOne({ user: decoded.id, refreshTokenHash: hash(token) });

  if (!session) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  const accessToken = signAccess(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
  });
  send(res, { accessToken });
}

export async function logout(req, res) {
  if (req.cookies.refreshToken) {
    await Session.deleteOne({ refreshTokenHash: hash(req.cookies.refreshToken) });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  send(res, { message: 'Logged out' });
}

export async function me(req, res) {
  send(res, { user: req.user });
}

export async function changePassword(req, res) {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = req.body.newPassword;
  await user.save();
  send(res, { message: 'Password changed' });
}

export async function updateProfile(req, res) {
  const user = await User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true });
  send(res, { user });
}

export async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    user.passwordResetOtp = String(Math.floor(100000 + Math.random() * 900000));
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
  }

  send(res, { message: 'If the email exists, an OTP has been issued' });
}

export async function verifyOtp(req, res) {
  const user = await User.findOne({
    email: req.body.email,
    passwordResetOtp: req.body.otp,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) throw new ApiError(400, 'Invalid OTP');

  user.password = req.body.password;
  user.passwordResetOtp = undefined;
  await user.save();
  send(res, { message: 'Password reset complete' });
}
