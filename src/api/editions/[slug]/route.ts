/**
 * OMNIVOID LABS - Single Edition API
 * 
 * GET /api/editions/[slug] - Get edition details with resources
 * Response: Edition object with all its resources
 */

import { prisma } from '../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
): Promise<Response> {
  try {
    const { slug } = params;

    const edition = await prisma.edition.findUnique({
      where: { slug },
      include: {
        resources: {
          where: { isActive: true },
          orderBy: [
            { sortOrder: 'asc' },
            { isFeatured: 'desc' },
            { createdAt: 'desc' }
          ]
        }
      }
    });

    if (!edition) {
      return Response.json(
        { success: false, error: 'NOT_FOUND', message: 'Edition not found' },
        { status: 404 }
      );
    }

    if (!edition.isActive) {
      return Response.json(
        { success: false, error: 'NOT_ACTIVE', message: 'This edition is not currently active' },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      data: edition
    });

  } catch (error) {
    console.error('Error fetching edition:', error);
    return Response.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'An error occurred while fetching edition' },
      { status: 500 }
    );
  }
}