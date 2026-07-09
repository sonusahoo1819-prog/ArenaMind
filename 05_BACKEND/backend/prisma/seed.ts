import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create default Commander users
  const commanderPassword = await bcrypt.hash('123456', 10);
  
  const defaultUsers = [
    {
      email: 'sonusahoo1819@gmail.com',
      name: 'Sonu Sahoo',
      role: 'COMMANDER',
      passwordHash: commanderPassword,
    },
    {
      email: 'admin@arenamind.os',
      name: 'Operations Commander',
      role: 'COMMANDER',
      passwordHash: commanderPassword,
    }
  ];

  for (const u of defaultUsers) {
    const existing = await prisma.user.findUnique({
      where: { email: u.email },
    });

    if (!existing) {
      await prisma.user.create({
        data: u,
      });
      console.log(`Created user: ${u.name} (${u.email})`);
    } else {
      console.log(`User already exists: ${u.email}`);
    }
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
