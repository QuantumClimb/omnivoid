/**
 * OMNIVOID LABS - Admin Gigs API
 * 
 * GET /api/admin/gigs - List all gigs
 * POST /api/admin/gigs - Create new gig
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// GET /api/admin/gigs - List all gigs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');
    const isActive = searchParams.get('isActive');
    const isFeatured = searchParams.get('isFeatured');

    const where: any = {};

    if (editionId) {
      where.editionId = editionId;
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (isFeatured !== null && isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    const gigs = await prisma.gig.findMany({
      where,
      include: {
        edition: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      data: gigs,
      count: gigs.length,
    });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gigs' },
      { status: 500 }
    );
  }
}

// POST /api/admin/gigs - Create new gig
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      editionId,
      title,
      subtitle,
      description,
      date,
      venue,
      location,
      address,
      hasWorkshop,
      workshopTitle,
      workshopDescription,
      workshopMaterials,
      workshopTime,
      images,
      videoUrl,
      mixcloudUrl,
      isFeatured,
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    const gig = await prisma.gig.create({
      data: {
        editionId,
        title,
        subtitle: subtitle || null,
        description: description || null,
        date: new Date(date),
        venue: venue || null,
        location: location || null,
        address: address || null,
        hasWorkshop: hasWorkshop || false,
        workshopTitle: workshopTitle || null,
        workshopDescription: workshopDescription || null,
        workshopMaterials: workshopMaterials ? JSON.stringify(workshopMaterials) : null,
        workshopTime: workshopTime ? new Date(workshopTime) : null,
        images: images || [],
        videoUrl: videoUrl || null,
        mixcloudUrl: mixcloudUrl || null,
        isFeatured: isFeatured || false,
        isPast: new Date(date) < new Date(),
      },
      include: {
        edition: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: gig,
      message: 'Gig created successfully',
    });
  } catch (error) {
    console.error('Error creating gig:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gig' },
      { status: 500 }
    );
  }
}