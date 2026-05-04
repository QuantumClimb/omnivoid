/**
 * OMNIVOID LABS - Admin Login API
 * 
 * POST /api/admin/login
 * Body: { "password": "admin-password" }
 * Response: { "token": "jwt-token", "expiresAt": "2024-01-01T00:00:00Z" }
 */

import { prisma } from '../../../lib/prisma';
import { verifyPassword, generateToken } from '../../../lib/auth';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Password is required' },
        { status: 400 }
      );
    }

    // Get the first active admin user
    const adminUser = await prisma.adminUser.findFirst({
      where: { isActive: true }
    });

    if (!adminUser) {
      return Response.json(
        { success: false, error: 'NO_ADMIN', message: 'No admin user configured. Please run the seed script first.' },
        { status: 503 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, adminUser.password);

    if (!isValid) {
      return Response.json(
        { success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(adminUser.id);

    // Calculate expiration (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return Response.json({
      success: true,
      token,
      expiresAt
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}