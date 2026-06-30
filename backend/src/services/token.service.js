import jwt from 'jsonwebtoken';import crypto from 'crypto';import {env} from '../config/env.js';import {Session} from '../models/misc.js';
export const signAccess=user=>jwt.sign({id:user._id,role:user.role},env.jwtSecret,{expiresIn:env.accessTtl});
export const signRefresh=user=>jwt.sign({id:user._id},env.jwtRefreshSecret,{expiresIn:env.refreshTtl});
export const hash=t=>crypto.createHash('sha256').update(t).digest('hex');
export async function createSession(user,req){const refresh=signRefresh(user);await Session.create({user:user._id,refreshTokenHash:hash(refresh),userAgent:req.get('user-agent'),ip:req.ip,expiresAt:new Date(Date.now()+30*864e5)});return {access:signAccess(user),refresh};}
