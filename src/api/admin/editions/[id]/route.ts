/**
 * OMNIVOID LABS - Admin Single Edition API
 * 
 * PUT /api/admin/editions/[id] - Update edition (requires auth)
 * DELETE /api/admin/editions/[id] - Delete edition (requires auth)
 */

import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';

// PUT /api/admin/editions/[id] - Update edition
async function handlePut(userId: string, request: Request): Promise<Response> {
  try {
    // Extract id from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Edition ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      logoUrl,
      themeColors,
      isActive,
      startDate,
      endDate,
      sortOrder
    } = body;

    // Check if edition exists
    const existing = await prisma.edition.findUnique({
      where: { id }
    });

    if (!existing) {
      return Response.json(
        { success: false, error: 'NOT_FOUND', message: 'Edition not found' },
        { status: 404 }
      );
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.edition.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return Response.json(
          { success: false, error: 'DUPLICATE_SLUG', message: 'An edition with this slug already exists' },
          { status: 409 }
        );
      }
    }

    // If this edition should be active, deactivate others
    if (isActive === true && !existing.isActive) {
      await prisma.edition.updateMany({
        where: { id: { not: id } },
        data: { isActive: false }
      });
    }

    // Update the edition
    const edition = await prisma.edition.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        logoUrl,
        themeColors,
        isActive,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
        sortOrder
      }
    });

    return Response.json({
      success: true,
      data: edition,
      message: 'Edition updated successfully'
    });

  } catch (error) {
    console.error('Error updating edition:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while updating the edition' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/editions/[id] - Delete edition
async function handleDelete(userId: string, request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Edition ID is required' },
        { status: 400 }
      );
    }

    // Check if edition exists
    const existing = await prisma.edition.findUnique({
      where: { id },
      include: {
        _count: {
          select: { resources: true }
        }
      }
    });

    if (!existing) {
      return Response.json(
        { success: false, error: 'NOT_FOUND', message: 'Edition not found' },
        { status: 404 }
      );
    }

    // Delete the edition (cascade will delete all resources)
    await prisma.edition.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Edition deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting edition:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while deleting the edition' },
      { status: 500 }
    );
  }
}

// Main handlers with authentication
export async function PUT(request: Request): Promise<Response> {
  return requireAuth(handlePut)(request);
}

export async function DELETE(request: Request): Promise<Response> {
  return requireAuth(handleDelete)(request);
}