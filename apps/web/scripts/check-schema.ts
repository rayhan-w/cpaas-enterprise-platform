import prisma from '../src/lib/prisma';

async function main() {
  const current = await prisma.$queryRawUnsafe('SELECT current_schema(), current_user, current_database();');
  console.log('Current DB/Schema/User:', current);

  const tables: any[] = await prisma.$queryRawUnsafe(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    ORDER BY table_schema, table_name;
  `);
  console.log('Found tables in DB:');
  for (const t of tables) {
    if (t.table_schema === 'public') {
      console.log(`  - schema: ${t.table_schema}, table: ${t.table_name}`);
    }
  }

  const catCount = await prisma.$queryRawUnsafe('SELECT count(*) FROM public.categories;');
  const prodCount = await prisma.$queryRawUnsafe('SELECT count(*) FROM public.products;');
  console.log('Total categories in public.categories:', catCount);
  console.log('Total products in public.products:', prodCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());
