import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const links = await prisma.link.findMany();
  console.log('Links:', JSON.stringify(links, null, 2));
  
  const resources = await prisma.resource.findMany();
  console.log('Resources:', JSON.stringify(resources, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
