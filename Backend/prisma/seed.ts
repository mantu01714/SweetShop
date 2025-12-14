import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sweetshop.com' },
    update: {},
    create: {
      email: 'admin@sweetshop.com',
      password: adminPassword,
      name: 'Sweet Shop Admin',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@sweetshop.com' },
    update: {},
    create: {
      email: 'user@sweetshop.com',
      password: userPassword,
      name: 'Sweet Shop User',
      role: 'USER',
    },
  });

  // Create sample sweets
  const sweets = [
    {
      name: 'Belgian Dark Chocolate',
      category: 'CHOCOLATE',
      price: 750,
      quantity: 25,
      description: 'Rich and creamy dark chocolate imported from Belgium',
    },
    {
      name: 'Rainbow Gummy Bears',
      category: 'GUMMY',
      price: 420,
      quantity: 50,
      description: 'Colorful assorted gummy bears in six fruity flavors',
    },
    {
      name: 'Strawberry Swirl Lollipop',
      category: 'LOLLIPOP',
      price: 210,
      quantity: 100,
      description: 'Classic strawberry flavored swirl lollipop',
    },
    {
      name: 'Vanilla Dream Cookie',
      category: 'COOKIE',
      price: 335,
      quantity: 0,
      description: 'Soft-baked vanilla cookies with white chocolate chips',
    },
  ];

  for (const sweet of sweets) {
    const existing = await prisma.sweet.findFirst({
      where: { name: sweet.name }
    });
    
    if (!existing) {
      await prisma.sweet.create({
        data: sweet
      });
    }
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });