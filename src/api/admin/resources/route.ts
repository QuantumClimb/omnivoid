/**
 * OMNIVOID LABS - Admin Resources API
 * 
 * GET /api/admin/resources?editionId=xxx - List resources (requires auth)
 * POST /api/admin/resources - Create new resource (requires auth)
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

// GET /api/admin/resources - List resources (optionally filtered by edition)
async function handleGet(_userId: string, request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const editionId = url.searchParams.get('editionId');

    const where: any = {};
    if (editionId) {
      where.editionId = editionId;
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        edition: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { editionId: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return Response.json({
      success: true,
      data: resources
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while fetching resources' },
      { status: 500 }
    );
  }
}

// POST /api/admin/resources - Create new resource
async function handlePost(_userId: string, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const {
      editionId,
      type,
      title,
      description,
      url,
      filePath,
      thumbnailUrl,
      metadata,
      sortOrder = 0,
      isFeatured = false,
      isActive = true
    } = body;

    // Validate required fields
    if (!editionId || !type || !title) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Edition ID, type, and title are required' },
        { status: 400 }
      );
    }

    // Check if edition exists
    const edition = await prisma.edition.findUnique({
      where: { id: editionId }
    });

    if (!edition) {
      return Response.json(
        { success: false, error: 'EDITION_NOT_FOUND', message: 'The specified edition does not exist' },
        { status: 404 }
      );
    }

    // Create the resource
    const resource = await prisma.resource.create({
      data: {
        editionId,
        type,
        title,
        description,
        url,
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
      message: 'Resource created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating resource:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while creating the resource' },
      { status: 500 }
    );
  }
}

// Main handlers with authentication
export async function GET(request: Request): Promise<Response> {
  return requireAuth(handleGet)(request);
}

export async function POST(request: Request): Promise<Response> {
  return requireAuth(handlePost)(request);
}