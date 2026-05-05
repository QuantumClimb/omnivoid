/**
 * OMNIVOID LABS - Legacy Text Migration API
 * 
 * Migrates content from public/links/*.txt into the database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminToken(request);
    if (!authResult.success) return NextResponse.json({ success: false, error: authResult.error }, { status: 401 });

    const publicDir = join(process.cwd(), 'public', 'links');

    // 1. Migrate Contact
    const contactPath = join(publicDir, 'contact.txt');
    const contactContent = await readFile(contactPath, 'utf-8').catch(() => '');
    if (contactContent) {
      await prisma.document.upsert({
        where: { slug: 'site-contact' },
        update: { content: contactContent, isActive: true },
        create: {
          title: 'Contact Information',
          slug: 'site-contact',
          type: 'CONTACT',
          content: contactContent,
          isActive: true
        }
      });
    }

    // 2. Migrate Conundrum (Manifesto)
    const conundrumPath = join(publicDir, 'conundrum.txt');
    const conundrumContent = await readFile(conundrumPath, 'utf-8').catch(() => '');
    if (conundrumContent) {
      await prisma.document.upsert({
        where: { slug: 'manifesto' },
        update: { content: conundrumContent, isActive: true },
        create: {
          title: 'OMNIVOID Manifesto',
          slug: 'manifesto',
          type: 'CONUNDRUM',
          content: conundrumContent,
          isActive: true
        }
      });
    }

    // 3. Migrate Labs YouTube Links
    const labsPath = join(publicDir, 'labs.txt');
    const labsContent = await readFile(labsPath, 'utf-8').catch(() => '');
    if (labsContent) {
      const labsLinks = labsContent.split('\n').map(l => l.trim()).filter(l => l && l.startsWith('http'));
      for (const [idx, url] of labsLinks.entries()) {
        await prisma.link.create({
          data: {
            title: `Lab Transmission ${idx + 1}`,
            url,
            type: 'YOUTUBE',
            category: 'labs',
            sortOrder: idx,
            isActive: true
          }
        });
      }
    }

    // 4. Migrate Live Transmissions
    const livePath = join(publicDir, 'live_transmissions.txt');
    const liveContent = await readFile(livePath, 'utf-8').catch(() => '');
    if (liveContent) {
      const liveLinks = liveContent.split('\n').map(l => l.trim()).filter(l => l && l.startsWith('http'));
      for (const [idx, url] of liveLinks.entries()) {
        await prisma.link.create({
          data: {
            title: `Live Transmission ${idx + 1}`,
            url,
            type: 'YOUTUBE',
            category: 'live_transmissions',
            sortOrder: idx,
            isActive: true
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Migration completed successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: 'Migration failed' }, { status: 500 });
  }
}
