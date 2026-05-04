/**
 * OMNIVOID LABS - Resources by Type API
 * 
 * GET /api/editions/[slug]/[type] - Get resources of a specific type for an edition
 * Types: audio, video, posters, documents, gallery
 * Response: Array of resource objects
 */

import { prisma } from '../../../../lib/prisma';

// Map URL-friendly type names to ResourceType enum values
const typeMap: Record<string, string> = {
  audio: 'AUDIO',
  video: 'VIDEO',
  posters: 'POSTER',
  documents: 'DOCUMENT',
  gallery: 'GALLERY',
  links: 'LINK',
  logos: 'LOGO',
  text: 'TEXT_CONTENT'
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string; type: string } }
): Promise<Response> {
  try {
    const { slug, type } = params;

    // Map the type parameter to the enum value
    const resourceType = typeMap[type.toLowerCase()];

    if (!resourceType) {
      return Response.json(
        { success: false, error: 'INVALID_TYPE', message: `Invalid resource type: ${type}` },
        { status: 400 }
      );
    }

    // Find the edition
    const edition = await prisma.edition.findUnique({
      where: { slug },
      select: { id: true, isActive: true }
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

    // Get resources of the specified type
    const resources = await prisma.resource.findMany({
      where: {
        editionId: edition.id,
        type: resourceType as any,
        isActive: true
      },
      orderBy: [
        { sortOrder: 'asc' },
        { isFeatured: 'desc' },
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