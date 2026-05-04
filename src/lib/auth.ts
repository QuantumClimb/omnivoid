/**
 * OMNIVOID LABS - Authentication Utilities
 * 
 * Provides password hashing, verification, and JWT token management
 * for the admin authentication system.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Hash a plain text password using bcrypt
 * @param password - The plain text password to hash
 * @returns The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hashed password
 * @param password - The plain text password to verify
 * @param hashedPassword - The hashed password to compare against
 * @returns True if the passwords match, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for an authenticated user
 * @param userId - The user ID to encode in the token
 * @returns The signed JWT token
 */
export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(
    { userId, type: 'admin' },
    secret,
    { expiresIn: '7d' }
  );
}

/**
 * Verify and decode a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded token payload if valid, null otherwise
 */
export function verifyToken(token: string): { userId: string; type: string } | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, secret) as { userId: string; type: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract and verify token from Authorization header
 * @param authHeader - The Authorization header value
 * @returns The decoded token payload if valid, null otherwise
 */
export function getTokenFromHeader(authHeader: string | undefined | null): { userId: string; type: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}

/**
 * Middleware-style function to check authentication
 * Returns a function that can be used to wrap API handlers
 */
export function requireAuth(
  handler: (userId: string, request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    const authHeader = request.headers.get('Authorization');
    const tokenData = getTokenFromHeader(authHeader);
    
    if (!tokenData) {
      return Response.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Invalid or missing authentication token' },
        { status: 401 }
      );
    }
    
    return handler(tokenData.userId, request);
  };
}