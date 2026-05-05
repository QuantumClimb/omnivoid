/**
 * OMNIVOID LABS - Admin Gig Specific API
 * 
 * GET /api/admin/gigs/[id] - Get a specific gig
 * PUT /api/admin/gigs/[id] - Update a gig
 * DELETE /api/admin/gigs/[id] - Delete a gig
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// GET /api/admin/gigs/[id] - Get a specific gig
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gig = await prisma.gig.findUnique({
      where: { id: params.id },
      include: {
        edition: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!gig) {
      return NextResponse.json(
        { success: false, error: 'Gig not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: gig });
  } catch (error) {
    console.error('Error fetching gig:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gig' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/gigs/[id] - Update a gig
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      isActive,
    } = body;

    const existingGig = await prisma.gig.findUnique({
      where: { id: params.id },
    });

    if (!existingGig) {
      return NextResponse.json(
        { success: false, error: 'Gig not found' },
        { status: 404 }
      );
    }

    const updatedGig = await prisma.gig.update({
      where: { id: params.id },
      data: {
        editionId: editionId !== undefined ? editionId : existingGig.editionId,
        title: title || existingGig.title,
        subtitle: subtitle !== undefined ? subtitle : existingGig.subtitle,
        description: description !== undefined ? description : existingGig.description,
        date: date ? new Date(date) : existingGig.date,
        venue: venue !== undefined ? venue : existingGig.venue,
        location: location !== undefined ? location : existingGig.location,
        address: address !== undefined ? address : existingGig.address,
        hasWorkshop: hasWorkshop !== undefined ? hasWorkshop : existingGig.hasWorkshop,
        workshopTitle: workshopTitle !== undefined ? workshopTitle : existingGig.workshopTitle,
        workshopDescription: workshopDescription !== undefined ? workshopDescription : existingGig.workshopDescription,
        workshopMaterials: workshopMaterials ? JSON.stringify(workshopMaterials) : existingGig.workshopMaterials,
        workshopTime: workshopTime ? new Date(workshopTime) : existingGig.workshopTime,
        images: images !== undefined ? images : existingGig.images,
        videoUrl: videoUrl !== undefined ? videoUrl : existingGig.videoUrl,
        mixcloudUrl: mixcloudUrl !== undefined ? mixcloudUrl : existingGig.mixcloudUrl,
        isFeatured: isFeatured !== undefined ? isFeatured : existingGig.isFeatured,
        isActive: isActive !== undefined ? isActive : existingGig.isActive,
        isPast: date ? new Date(date) < new Date() : existingGig.isPast,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedGig,
      message: 'Gig updated successfully',
    });
  } catch (error) {
    console.error('Error updating gig:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gig' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/gigs/[id] - Delete a gig
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    await prisma.gig.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Gig deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gig:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gig' },
      { status: 500 }
    );
  }
}
