/**
 * Seed - Datos iniciales para desarrollo
 *
 * Crea un usuario por defecto para pruebas.
 * Ejecutar: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const defaultUserId = '00000000-0000-4000-8000-000000000000';
  await prisma.user.upsert({
    where: { id: defaultUserId },
    update: {},
    create: {
      id: defaultUserId,
      email: 'dev@localhost',
    },
  });
  console.log('Seed: usuario por defecto creado (id:', defaultUserId, ')');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
