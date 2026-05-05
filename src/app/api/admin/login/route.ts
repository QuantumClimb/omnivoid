/**
 * OMNIVOID LABS - Admin Login API
 * 
 * POST /api/admin/login
 * Body: { "email": "admin@omnivoidlabs.com", "password": "admin-password" }
 * Response: { "success": true, "token": "jwt-token", "expiresAt": "2024-01-01T00:00:00Z" }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'INVALID_INPUT', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin user by email
    const adminUser = await prisma.adminUser.findFirst({
      where: { 
        email: email,
        isActive: true 
      }
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, adminUser.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(adminUser.id);

    // Calculate expiration (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      token,
      expiresAt
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}