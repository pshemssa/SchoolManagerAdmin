const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash('sha512').update(password).digest('hex');
}

async function main() {
  // Create default admin
  const admin = await prisma.admin.create({
    data: {
      name: 'Admin',
      email: 'admin@school.com',
      password: hashPassword('admin123'),
      role: 'admin'
    }
  });

  console.log('Admin created:', admin.email);
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
