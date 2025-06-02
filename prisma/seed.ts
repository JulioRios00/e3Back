import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@luthiersshop.com' },
    update: {},
    create: {
      email: 'admin@luthiersshop.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      birthday: new Date('1980-01-01'),
      role: Role.ADMIN,
    },
  });

  // Create sample users
  const userPassword = await bcrypt.hash('user123', 12);
  
  const users = [
    {
      email: 'john.doe@example.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
      birthday: new Date('1990-12-25'), // Christmas birthday
      role: Role.USER,
    },
    {
      email: 'jane.smith@example.com',
      password: userPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1234567892',
      birthday: new Date('1985-07-04'), // July 4th birthday
      role: Role.USER,
    },
    {
      email: 'bob.johnson@example.com',
      password: userPassword,
      firstName: 'Bob',
      lastName: 'Johnson',
      phone: '+1234567893',
      birthday: new Date('1992-03-15'),
      role: Role.USER,
    },
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin user: admin@luthiersshop.com / admin123');
  console.log('👥 Sample users created with password: user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });