import { PrismaClient } from '@prisma/client';

interface CategoryData {
  name: string;
  slug: string;
  icon?: string;
  sortOrder: number;
  children?: Omit<CategoryData, 'children'>[];
}

export async function seedCategories(prisma: PrismaClient) {
  console.log('Seeding categories...');

  const categories: CategoryData[] = [
    {
      name: 'Alimentos',
      slug: 'alimentos',
      icon: '🍽️',
      sortOrder: 1,
      children: [
        { name: 'Arroz e Grãos', slug: 'arroz-graos', sortOrder: 1 },
        { name: 'Massas', slug: 'massas', sortOrder: 2 },
        { name: 'Conservas', slug: 'conservas', sortOrder: 3 },
        { name: 'Temperos e Condimentos', slug: 'temperos-condimentos', sortOrder: 4 },
        { name: 'Açúcar e Adoçantes', slug: 'acucar-adocantes', sortOrder: 5 },
        { name: 'Farinhas', slug: 'farinhas', sortOrder: 6 },
        { name: 'Cereais Matinais', slug: 'cereais-matinais', sortOrder: 7 },
        { name: 'Óleos e Azeites', slug: 'oleos-azeites', sortOrder: 8 },
      ],
    },
    {
      name: 'Bebidas',
      slug: 'bebidas',
      icon: '🥤',
      sortOrder: 2,
      children: [
        { name: 'Águas', slug: 'aguas', sortOrder: 1 },
        { name: 'Refrigerantes', slug: 'refrigerantes', sortOrder: 2 },
        { name: 'Sucos', slug: 'sucos', sortOrder: 3 },
        { name: 'Cervejas', slug: 'cervejas', sortOrder: 4 },
        { name: 'Vinhos', slug: 'vinhos', sortOrder: 5 },
        { name: 'Destilados', slug: 'destilados', sortOrder: 6 },
        { name: 'Café e Chá', slug: 'cafe-cha', sortOrder: 7 },
      ],
    },
    {
      name: 'Laticínios',
      slug: 'laticinios',
      icon: '🥛',
      sortOrder: 3,
      children: [
        { name: 'Leites', slug: 'leites', sortOrder: 1 },
        { name: 'Queijos', slug: 'queijos', sortOrder: 2 },
        { name: 'Iogurtes', slug: 'iogurtes', sortOrder: 3 },
        { name: 'Manteigas e Margarinas', slug: 'manteigas-margarinas', sortOrder: 4 },
        { name: 'Requeijões', slug: 'requeijoes', sortOrder: 5 },
      ],
    },
    {
      name: 'Carnes e Peixes',
      slug: 'carnes-peixes',
      icon: '🥩',
      sortOrder: 4,
      children: [
        { name: 'Carnes Bovinas', slug: 'carnes-bovinas', sortOrder: 1 },
        { name: 'Carnes Suínas', slug: 'carnes-suinas', sortOrder: 2 },
        { name: 'Aves', slug: 'aves', sortOrder: 3 },
        { name: 'Peixes', slug: 'peixes', sortOrder: 4 },
        { name: 'Frutos do Mar', slug: 'frutos-mar', sortOrder: 5 },
        { name: 'Embutidos', slug: 'embutidos', sortOrder: 6 },
      ],
    },
    {
      name: 'Hortifruti',
      slug: 'hortifruti',
      icon: '🥬',
      sortOrder: 5,
      children: [
        { name: 'Frutas', slug: 'frutas', sortOrder: 1 },
        { name: 'Legumes', slug: 'legumes', sortOrder: 2 },
        { name: 'Verduras', slug: 'verduras', sortOrder: 3 },
        { name: 'Orgânicos', slug: 'organicos', sortOrder: 4 },
      ],
    },
    {
      name: 'Padaria e Confeitaria',
      slug: 'padaria-confeitaria',
      icon: '🍞',
      sortOrder: 6,
      children: [
        { name: 'Pães', slug: 'paes', sortOrder: 1 },
        { name: 'Bolos', slug: 'bolos', sortOrder: 2 },
        { name: 'Tortas', slug: 'tortas', sortOrder: 3 },
        { name: 'Biscoitos', slug: 'biscoitos', sortOrder: 4 },
      ],
    },
    {
      name: 'Limpeza',
      slug: 'limpeza',
      icon: '🧹',
      sortOrder: 7,
      children: [
        { name: 'Detergentes', slug: 'detergentes', sortOrder: 1 },
        { name: 'Sabões', slug: 'saboes', sortOrder: 2 },
        { name: 'Amaciantes', slug: 'amaciantes', sortOrder: 3 },
        { name: 'Desinfetantes', slug: 'desinfetantes', sortOrder: 4 },
        { name: 'Limpeza Geral', slug: 'limpeza-geral', sortOrder: 5 },
      ],
    },
    {
      name: 'Higiene Pessoal',
      slug: 'higiene-pessoal',
      icon: '🧴',
      sortOrder: 8,
      children: [
        { name: 'Shampoos', slug: 'shampoos', sortOrder: 1 },
        { name: 'Condicionadores', slug: 'condicionadores', sortOrder: 2 },
        { name: 'Sabonetes', slug: 'sabonetes', sortOrder: 3 },
        { name: 'Desodorantes', slug: 'desodorantes', sortOrder: 4 },
        { name: 'Cremes Dentais', slug: 'cremes-dentais', sortOrder: 5 },
        { name: 'Papel Higiênico', slug: 'papel-higienico', sortOrder: 6 },
      ],
    },
    {
      name: 'Bebê',
      slug: 'bebe',
      icon: '👶',
      sortOrder: 9,
      children: [
        { name: 'Fraldas', slug: 'fraldas', sortOrder: 1 },
        { name: 'Lenços Umedecidos', slug: 'lencos-umedecidos', sortOrder: 2 },
        { name: 'Alimentos Infantis', slug: 'alimentos-infantis', sortOrder: 3 },
        { name: 'Higiene do Bebê', slug: 'higiene-bebe', sortOrder: 4 },
      ],
    },
    {
      name: 'Pet',
      slug: 'pet',
      icon: '🐾',
      sortOrder: 10,
      children: [
        { name: 'Ração para Cães', slug: 'racao-caes', sortOrder: 1 },
        { name: 'Ração para Gatos', slug: 'racao-gatos', sortOrder: 2 },
        { name: 'Petiscos', slug: 'petiscos', sortOrder: 3 },
        { name: 'Higiene Pet', slug: 'higiene-pet', sortOrder: 4 },
      ],
    },
  ];

  let totalCategories = 0;

  for (const category of categories) {
    const parentCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        icon: category.icon,
        sortOrder: category.sortOrder,
      },
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        sortOrder: category.sortOrder,
      },
    });

    totalCategories++;

    if (category.children) {
      for (const child of category.children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: {
            name: child.name,
            sortOrder: child.sortOrder,
            parentId: parentCategory.id,
          },
          create: {
            name: child.name,
            slug: child.slug,
            sortOrder: child.sortOrder,
            parentId: parentCategory.id,
          },
        });
        totalCategories++;
      }
    }
  }

  console.log(`✅ Seeded ${totalCategories} categories`);
}
