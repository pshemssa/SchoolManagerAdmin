require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const createAdmin = async () => {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@school.com' }
    });

    if (existingAdmin) {
      console.log('Admin already exists!');
      await prisma.$disconnect();
      process.exit(0);
    }

    const password = 'admin123';
    const hashedPassword = crypto.createHash('sha512').update(password).digest('hex');

    await prisma.admin.create({
      data: {
        name: 'System Administrator',
        email: 'admin@school.com',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('Admin created successfully!');
    console.log('Email: admin@school.com');
    console.log('Password: admin123');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

createAdmin();
