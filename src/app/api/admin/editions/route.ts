/**
 * OMNIVOID LABS - Admin Editions API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const editions = await prisma.edition.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ success: true, data: editions });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch editions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) return NextResponse.json({ success: false, error: authResult.error }, { status: 401 });

    const body = await request.json();
    const { name, slug, description, logoUrl, themeColors, isActive, startDate, endDate, sortOrder } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: 'Name and Slug are required' }, { status: 400 });
    }

    const edition = await prisma.edition.create({
      data: {
        name,
        slug,
        description,
        logoUrl,
        themeColors: themeColors || {},
        isActive: isActive || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ success: true, data: edition, message: 'Edition created successfully' });
  } catch (error) {
    console.error('Error creating edition:', error);
    return NextResponse.json({ success: false, error: 'Failed to create edition' }, { status: 500 });
  }
}
