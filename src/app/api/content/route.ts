/**
 * OMNIVOID LABS - Unified Content API
 * 
 * This endpoint serves all content for the frontend.
 * It combines database content with file system resources.
 * 
 * GET /api/content - Returns all content structure
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';

// Helper function to scan directory for files
async function scanDirectory(dirPath: string, baseUrl: string): Promise<{ id: string; title: string; path: string; type: string }[]> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const items = [];

    for (const entry of entries) {
      if (entry.isFile() && !entry.name.startsWith('.')) {
        const ext = entry.name.split('.').pop()?.toLowerCase();
        let type = 'unknown';
        
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) type = 'audio';
        else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) type = 'image';
        else if (['pdf', 'doc', 'docx'].includes(ext || '')) type = 'doc';
        else if (['txt', 'md'].includes(ext || '')) type = 'text';

        const name = entry.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        items.push({
          id: entry.name,
          title: name.charAt(0).toUpperCase() + name.slice(1),
          path: `${baseUrl}/${entry.name}`,
          type,
        });
      }
    }

    return items.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const publicDir = join(process.cwd(), 'public');

    // Scan file system for resources
    const [docs, audio, gallery, gigs] = await Promise.all([
      scanDirectory(join(publicDir, 'docs'), '/docs'),
      scanDirectory(join(publicDir, 'audio'), '/audio'),
      scanDirectory(join(publicDir, 'gallery'), '/gallery'),
      scanDirectory(join(publicDir, 'gigs'), '/gigs').then(items => items.filter(i => i.type === 'image')),
    ]);

    // Get database content
    const [dbLinks, dbDocuments, editions, dbResources] = await Promise.all([
      prisma.link.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }).catch(() => []),
      prisma.document.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }).catch(() => []),
      prisma.edition.findMany({
        orderBy: { sortOrder: 'asc' },
      }).catch(() => []),
      prisma.resource.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }).catch(() => []),
    ]);

    const activeEdition = editions.find(e => e.isActive) || editions[0];

    // Get latest gig for "Latest Rituals" button
    const latestGig = await prisma.gig.findFirst({
      where: { isActive: true },
      orderBy: { date: 'desc' },
      include: {
        edition: {
          select: { id: true, name: true, slug: true },
        },
      },
    }).catch(() => null);

    // Build resources structure
    const resources = dbResources.map(res => ({
      id: res.id,
      title: res.title,
      path: res.url || res.filePath || '',
      type: res.type.toLowerCase(),
      editionId: res.editionId,
    }));

    // Build links structure from database
    const links = dbLinks.map(link => ({
      id: link.id,
      title: link.title,
      path: link.url,
      type: 'link' as const,
      linkType: link.type,
      category: link.category,
      metadata: link.metadata,
      editionId: (link.metadata as any)?.editionId || link.editionId,
    }));

    // Build documents structure from database
    const documents = dbDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      type: doc.type,
      excerpt: doc.excerpt,
      fileUrl: doc.fileUrl,
      editionId: doc.editionId,
    }));

    return NextResponse.json({
      success: true,
      data: {
        // File system resources (only audio/gallery now)
        audio,
        gallery,
        gigs,
        
        // Database content
        links,
        documents,
        resources,
        editions: editions.map(e => ({
          id: e.id,
          name: e.name,
          slug: e.slug,
          isActive: e.isActive,
          sortOrder: e.sortOrder,
        })),
        
        // Latest gig for "Latest Rituals" button
        latestGig: latestGig ? {
          id: latestGig.id,
          title: latestGig.title,
          subtitle: latestGig.subtitle,
          description: latestGig.description,
          date: latestGig.date,
          venue: latestGig.venue,
          location: latestGig.location,
          hasWorkshop: latestGig.hasWorkshop,
          workshopTitle: latestGig.workshopTitle,
          workshopDescription: latestGig.workshopDescription,
          workshopMaterials: latestGig.workshopMaterials ? JSON.parse(latestGig.workshopMaterials as string) : null,
          images: latestGig.images,
          videoUrl: latestGig.videoUrl,
          mixcloudUrl: latestGig.mixcloudUrl,
          edition: latestGig.edition,
        } : null,

        // Active edition
        currentEdition: activeEdition ? {
          id: activeEdition.id,
          name: activeEdition.name,
          slug: activeEdition.slug,
          description: activeEdition.description,
          themeColors: activeEdition.themeColors,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { 
        success: true, 
        data: {
          docs: [],
          audio: [],
          gallery: [],
          gigs: [],
          links: [],
          documents: [],
          resources: [],
          editions: [],
          latestGig: null,
          currentEdition: null,
        },
        error: 'Failed to load content'
      },
      { status: 200 }
    );
  }
}