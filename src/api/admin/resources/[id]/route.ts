/**
 * OMNIVOID LABS - Admin Single Resource API
 * 
 * PUT /api/admin/resources/[id] - Update resource (requires auth)
 * DELETE /api/admin/resources/[id] - Delete resource (requires auth)
 */

import { prisma } from '../../../../lib/prisma';
import { requireAuth } from '../../../../lib/auth';

// PUT /api/admin/resources/[id] - Update resource
async function handlePut(_userId: string, request: Request): Promise<Response> {
  try {
    // Extract id from URL path
    const requestUrl = new URL(request.url);
    const pathParts = requestUrl.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Resource ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      type,
      title,
      description,
      url: resourceUrl,
      filePath,
      thumbnailUrl,
      metadata,
      sortOrder,
      isFeatured,
      isActive
    } = body;

    // Check if resource exists
    const existing = await prisma.resource.findUnique({
      where: { id }
    });

    if (!existing) {
      return Response.json(
        { success: false, error: 'NOT_FOUND', message: 'Resource not found' },
        { status: 404 }
      );
    }

    // Update the resource
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        type,
        title,
        description,
        url: resourceUrl,
        filePath,
        thumbnailUrl,
        metadata,
        sortOrder,
        isFeatured,
        isActive
      },
      include: {
        edition: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      data: resource,
      message: 'Resource updated successfully'
    });

  } catch (error) {
    console.error('Error updating resource:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while updating the resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/resources/[id] - Delete resource
async function handleDelete(_userId: string, request: Request): Promise<Response> {
  try {
    const requestUrl = new URL(request.url);
    const pathParts = requestUrl.pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Resource ID is required' },
        { status: 400 }
      );
    }

    // Check if resource exists
    const existing = await prisma.resource.findUnique({
      where: { id }
    });

    if (!existing) {
      return Response.json(
        { success: false, error: 'NOT_FOUND', message: 'Resource not found' },
        { status: 404 }
      );
    }

    // Delete the resource
    await prisma.resource.delete({
      where: { id }
    });

    return Response.json({
      success: true,
      message: 'Resource deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting resource:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while deleting the resource' },
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