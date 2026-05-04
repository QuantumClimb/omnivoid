/**
 * OMNIVOID LABS - Public Editions API
 * 
 * GET /api/editions - Get all active editions
 * Response: Array of edition objects
 */

import { prisma } from '../../lib/prisma';

export async function GET(): Promise<Response> {
  try {
    const editions = await prisma.edition.findMany({
      where: { isActive: true },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        themeColors: true,
        isActive: true,
        startDate: true,
        endDate: true
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