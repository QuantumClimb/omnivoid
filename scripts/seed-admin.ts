/**
 * OMNIVOID LABS - Admin User Seed Script
 * 
 * This script creates the initial admin user in the database.
 * Run with: npx tsx scripts/seed-admin.ts
 * 
 * The admin password is read from the ADMIN_PASSWORD environment variable.
 */

import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth';

async function main() {
  console.log('🌱 Seeding admin user...');

  // Get admin password from environment
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('❌ Error: ADMIN_PASSWORD environment variable is not set');
    console.log('Please set ADMIN_PASSWORD in your .env file or run:');
    console.log('  export ADMIN_PASSWORD="your-secure-password"');
    process.exit(1);
  }

  if (adminPassword.length < 8) {
    console.error('❌ Error: ADMIN_PASSWORD must be at least 8 characters long');
    process.exit(1);
  }

  // Hash the password
  const hashedPassword = await hashPassword(adminPassword);

  // Check if admin user already exists
  const existingAdmin = await prisma.adminUser.findFirst({
    where: { email: 'admin@omnivoidlabs.com' }
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists. Updating password...');
    await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: { password: hashedPassword }
    });
    console.log('✅ Admin password updated successfully!');
  } else {
    // Create the admin user
    await prisma.adminUser.create({
      data: {
        email: 'admin@omnivoidlabs.com',
        password: hashedPassword,
        isActive: true
      }
    });
    console.log('✅ Admin user created successfully!');
  }

  // Create default site settings if they don't exist
  const settings = [
    { key: 'currentEdition', value: null },
    { key: 'siteTitle', value: 'OMNIVOID LABS' },
    { key: 'siteDescription', value: 'A concert series exploring the intersections of sound, art, and technology' }
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    });
  }
  console.log('✅ Default site settings created!');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Set up your DATABASE_URL in .env');
  console.log('2. Run: npx prisma migrate dev');
  console.log('3. Run: npm run seed:admin');
  console.log('4. Start using the admin API endpoints');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });