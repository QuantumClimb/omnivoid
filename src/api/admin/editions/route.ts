/**
 * OMNIVOID LABS - Admin Editions API
 * 
 * GET /api/admin/editions - List all editions (requires auth)
 * POST /api/admin/editions - Create new edition (requires auth)
 */

import { prisma } from '../../../lib/prisma';
import { requireAuth } from '../../../lib/auth';

// GET /api/admin/editions - List all editions
async function handleGet(_userId: string, request: Request): Promise<Response> {
  try {
    const editions = await prisma.edition.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { resources: true }
        }
      }
    });

    return Response.json({
      success: true,
      data: editions
    });

  } catch (error) {
    console.error('Error fetching editions:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while fetching editions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/editions - Create new edition
async function handlePost(_userId: string, request: Request): Promise<Response> {
  try {
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
      sortOrder = 0
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return Response.json(
        { success: false, error: 'INVALID_INPUT', message: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.edition.findUnique({
      where: { slug }
    });

    if (existing) {
      return Response.json(
        { success: false, error: 'DUPLICATE_SLUG', message: 'An edition with this slug already exists' },
        { status: 409 }
      );
    }

    // If this edition should be active, deactivate others
    let editionsToCreate = [{
      name,
      slug,
      description,
      logoUrl,
      themeColors,
      isActive,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      sortOrder
    }];

    // Create the edition
    const edition = await prisma.edition.create({
      data: editionsToCreate[0]
    });

    return Response.json({
      success: true,
      data: edition,
      message: 'Edition created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating edition:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while creating the edition' },
      { status: 500 }
    );
  }
}

// Main handler with authentication
export async function GET(request: Request): Promise<Response> {
  return requireAuth(handleGet)(request);
}

export async function POST(request: Request): Promise<Response> {
  return requireAuth(handlePost)(request);
}