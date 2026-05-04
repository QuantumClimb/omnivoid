/**
 * OMNIVOID LABS - Content Migration Script
 * 
 * This script migrates existing static content from the public/ folder
 * into the database for dynamic management.
 * 
 * Run with: npx tsx scripts/migrate-content.ts
 */

import { prisma } from '../src/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// File path helpers
const publicDir = path.join(process.cwd(), 'public');

async function main() {
  console.log('🔄 Starting content migration...');

  // Check if an edition exists, if not create a default one
  let edition = await prisma.edition.findFirst({
    where: { slug: '2024' }
  });

  if (!edition) {
    console.log('📦 Creating default edition "OMNIVOID 2024"...');
    edition = await prisma.edition.create({
      data: {
        name: 'OMNIVOID 2024',
        slug: '2024',
        description: 'Current edition - migrated from static content',
        isActive: true,
        sortOrder: 0
      }
    });
    console.log('✅ Edition created with ID:', edition.id);
  } else {
    console.log('✅ Using existing edition:', edition.name);
  }

  // Migrate text content from public/links/
  console.log('\n📄 Migrating text content...');
  const textFiles = ['conundrum.txt', 'contact.txt', 'labs.txt', 'live_transmissions.txt'];
  
  for (const file of textFiles) {
    const filePath = path.join(publicDir, 'links', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const title = file.replace('.txt', '').replace('_', ' ').toUpperCase();
      
      // Check if already migrated
      const existing = await prisma.resource.findFirst({
        where: {
          editionId: edition!.id,
          type: 'TEXT_CONTENT',
          title: title
        }
      });

      if (!existing) {
        await prisma.resource.create({
          data: {
            editionId: edition!.id,
            type: 'TEXT_CONTENT',
            title: title,
            description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            filePath: `public/links/${file}`,
            metadata: { content },
            isActive: true
          }
        });
        console.log(`  ✅ Migrated: ${title}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${title}`);
      }
    } else {
      console.log(`  ⚠️  File not found: ${filePath}`);
    }
  }

  // Migrate gallery images
  console.log('\n🖼️  Migrating gallery images...');
  const galleryDir = path.join(publicDir, 'gallery');
  if (fs.existsSync(galleryDir)) {
    const images = fs.readdirSync(galleryDir).filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
    for (const image of images) {
      const existing = await prisma.resource.findFirst({
        where: {
          editionId: edition!.id,
          type: 'GALLERY',
          title: image
        }
      });

      if (!existing) {
        await prisma.resource.create({
          data: {
            editionId: edition!.id,
            type: 'GALLERY',
            title: image.replace(/\.[^/.]+$/, ''),
            filePath: `public/gallery/${image}`,
            isActive: true
          }
        });
        console.log(`  ✅ Migrated: ${image}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${image}`);
      }
    }
  }

  // Migrate posters/gigs
  console.log('\n posters Migrating posters...');
  const gigsDir = path.join(publicDir, 'gigs');
  if (fs.existsSync(gigsDir)) {
    const posters = fs.readdirSync(gigsDir).filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));
    for (const poster of posters) {
      const existing = await prisma.resource.findFirst({
        where: {
          editionId: edition!.id,
          type: 'POSTER',
          title: poster
        }
      });

      if (!existing) {
        await prisma.resource.create({
          data: {
            editionId: edition!.id,
            type: 'POSTER',
            title: poster.replace(/\.[^/.]+$/, ''),
            filePath: `public/gigs/${poster}`,
            isActive: true
          }
        });
        console.log(`  ✅ Migrated: ${poster}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${poster}`);
      }
    }
  }

  // Migrate documents
  console.log('\n📑 Migrating documents...');
  const docsDir = path.join(publicDir, 'docs');
  if (fs.existsSync(docsDir)) {
    const docs = fs.readdirSync(docsDir).filter(f => /\.(pdf|doc|docx|txt)$/i.test(f));
    for (const doc of docs) {
      const existing = await prisma.resource.findFirst({
        where: {
          editionId: edition!.id,
          type: 'DOCUMENT',
          title: doc
        }
      });

      if (!existing) {
        await prisma.resource.create({
          data: {
            editionId: edition!.id,
            type: 'DOCUMENT',
            title: doc.replace(/\.[^/.]+$/, ''),
            filePath: `public/docs/${doc}`,
            isActive: true
          }
        });
        console.log(`  ✅ Migrated: ${doc}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${doc}`);
      }
    }
  }

  // Migrate audio files
  console.log('\n🎵 Migrating audio files...');
  const audioDir = path.join(publicDir, 'audio');
  if (fs.existsSync(audioDir)) {
    const audioFiles = fs.readdirSync(audioDir).filter(f => /\.(mp3|wav|ogg|flac|m4a)$/i.test(f));
    for (const audio of audioFiles) {
      const existing = await prisma.resource.findFirst({
        where: {
          editionId: edition!.id,
          type: 'AUDIO',
          title: audio
        }
      });

      if (!existing) {
        await prisma.resource.create({
          data: {
            editionId: edition!.id,
            type: 'AUDIO',
            title: audio.replace(/\.[^/.]+$/, ''),
            filePath: `public/audio/${audio}`,
            isActive: true
          }
        });
        console.log(`  ✅ Migrated: ${audio}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${audio}`);
      }
    }
  }

  // Migrate logos
  console.log('\n🎨 Migrating logos...');
  const logosDir = path.join(publicDir, 'logos');
  if (fs.existsSync(logosDir)) {
    const logos = fs.readdirSync(logosDir).filter(f => /\.(svg|png|jpg|jpeg|webp)$/i.test(f));
    for (const logo of logos) {
      const existing = await prisma.resource.findFirst({
        where: {
          editionId: edition!.id,
          type: 'LOGO',
          title: logo
        }
      });

      if (!existing) {
        await prisma.resource.create({
          data: {
            editionId: edition!.id,
            type: 'LOGO',
            title: logo.replace(/\.[^/.]+$/, ''),
            filePath: `public/logos/${logo}`,
            isActive: true
          }
        });
        console.log(`  ✅ Migrated: ${logo}`);
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${logo}`);
      }
    }
  }

  console.log('\n🎉 Content migration completed!');
  console.log('\nSummary:');
  const resourceCount = await prisma.resource.count({
    where: { editionId: edition!.id }
  });
  console.log(`  Total resources migrated: ${resourceCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });