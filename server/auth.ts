import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Database } from 'sql.js';
import { executeRun } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hrk-education-system-secret-jwt-key-peshawar-2026';
const STAFF_CODE_DEFAULT = process.env.STAFF_SECRET_CODE || 'HRK777';

export interface StaffJwtPayload {
  userId: number;
  username: string;
  displayName: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  staffUser?: StaffJwtPayload;
}

// In-memory rate limiting for login attempts
interface RateLimitRecord {
  attempts: number;
  lockedUntil: number;
}
const loginRateLimits = new Map<string, RateLimitRecord>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const record = loginRateLimits.get(ip);
  const now = Date.now();
  if (record && record.lockedUntil > now) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, waitSeconds: remaining };
  }
  return { allowed: true };
}

export function recordLoginAttempt(ip: string, success: boolean): void {
  const now = Date.now();
  const record = loginRateLimits.get(ip) || { attempts: 0, lockedUntil: 0 };

  if (success) {
    loginRateLimits.delete(ip);
    return;
  }

  record.attempts += 1;
  // If 5 or more failures, lock out for 5 minutes (300,000 ms)
  if (record.attempts >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000;
  }
  loginRateLimits.set(ip, record);
}

export function signStaffToken(payload: StaffJwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyStaffToken(token: string): StaffJwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as StaffJwtPayload;
  } catch {
    return null;
  }
}

export function requireStaffAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // Check Cookie first, then Authorization Header
  let token = req.cookies?.hrk_staff_token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Unauthorized: Staff authentication required' });
    return;
  }

  const payload = verifyStaffToken(token);
  if (!payload) {
    res.status(401).json({ success: false, error: 'Unauthorized: Session expired or invalid token' });
    return;
  }

  req.staffUser = payload;
  next();
}

export function logAudit(
  db: Database,
  staffUsername: string,
  actionType: string,
  entityType: string,
  entityId: string | number | null,
  details: string
): void {
  const now = new Date().toISOString();
  try {
    executeRun(
      db,
      `INSERT INTO audit_logs (timestamp, staff_username, action_type, entity_type, entity_id, details)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [now, staffUsername, actionType, entityType, entityId !== null ? String(entityId) : null, details]
    );
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
}
