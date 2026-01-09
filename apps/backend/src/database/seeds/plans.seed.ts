import { PrismaClient, PlanType } from '@prisma/client';

export async function seedPlans(prisma: PrismaClient) {
  console.log('Seeding plans...');

  const plans = [
    {
      name: 'Gratuito',
      type: PlanType.consumer,
      compareLimit: 2,
      alertLimit: 3,
      featuredLimit: null,
      features: {
        priceHistory: false,
        recommendations: false,
        exportLists: false,
      },
      priceCents: 0,
      isActive: true,
    },
    {
      name: 'Simples',
      type: PlanType.consumer,
      compareLimit: 5,
      alertLimit: 10,
      featuredLimit: null,
      features: {
        priceHistory: true,
        recommendations: true,
        exportLists: true,
      },
      priceCents: 990,
      isActive: true,
    },
    {
      name: 'Premium',
      type: PlanType.consumer,
      compareLimit: null,
      alertLimit: null,
      featuredLimit: null,
      features: {
        priceHistory: true,
        recommendations: true,
        exportLists: true,
        prioritySupport: true,
        advancedAnalytics: true,
      },
      priceCents: 1990,
      isActive: true,
    },
    {
      name: 'Básico',
      type: PlanType.supermarket,
      compareLimit: null,
      alertLimit: null,
      featuredLimit: 5,
      features: {
        productCatalog: true,
        basicReports: true,
      },
      priceCents: 0,
      isActive: true,
    },
    {
      name: 'Profissional',
      type: PlanType.supermarket,
      compareLimit: null,
      alertLimit: null,
      featuredLimit: 20,
      features: {
        productCatalog: true,
        basicReports: true,
        advancedAnalytics: true,
        featuredProducts: true,
        promotions: true,
      },
      priceCents: 9900,
      isActive: true,
    },
    {
      name: 'Enterprise',
      type: PlanType.supermarket,
      compareLimit: null,
      alertLimit: null,
      featuredLimit: null,
      features: {
        productCatalog: true,
        basicReports: true,
        advancedAnalytics: true,
        featuredProducts: true,
        promotions: true,
        apiIntegration: true,
        dedicatedSupport: true,
        customReports: true,
      },
      priceCents: 29900,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  console.log(`✅ Seeded ${plans.length} plans`);
}
