/**
 * OMNIVOID LABS - Document Migration Script
 * 
 * This script migrates "Conundrum" and "Contact" text content from the public/links/ folder
 * into the Document table for dynamic management.
 * 
 * Run with: npx tsx scripts/migrate-documents.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const publicDir = path.join(process.cwd(), 'public');

async function main() {
  console.log('🔄 Starting document migration...');

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
        description: 'Current edition',
        isActive: true,
        sortOrder: 0
      }
    });
    console.log('✅ Edition created with ID:', edition.id);
  } else {
    console.log('✅ Using existing edition:', edition.name);
  }

  // Migrate text content from public/links/
  console.log('\n📄 Migrating text content to Documents table...');
  const textFiles = [
    { file: 'conundrum.txt', type: 'CONUNDRUM', title: 'CONUNDRUM' },
    { file: 'contact.txt', type: 'CONTACT', title: 'CONTACT' }
  ];
  
  for (const { file, type, title } of textFiles) {
    const filePath = path.join(publicDir, 'links', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Upsert to Document table
      const document = await prisma.document.upsert({
        where: { slug: file.replace('.txt', '') },
        update: {
          content,
          isActive: true,
          editionId: edition.id
        },
        create: {
          title,
          slug: file.replace('.txt', ''),
          type: type as any,
          content,
          isActive: true,
          editionId: edition.id
        }
      });

      console.log(`  ✅ Migrated ${title} to Document table (ID: ${document.id})`);
    } else {
      console.log(`  ⚠️  File not found: ${filePath}`);
    }
  }

  console.log('\n🎉 Document migration completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
