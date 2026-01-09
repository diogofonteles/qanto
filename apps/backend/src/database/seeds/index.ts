import { PrismaClient } from '@prisma/client';
import { seedPlans } from './plans.seed';
import { seedCategories } from './categories.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

  try {
    await seedPlans(prisma);
    await seedCategories(prisma);

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
