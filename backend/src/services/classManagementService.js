const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ClassManagementService {
  async getAllClasses() {
    return await prisma.class.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getClassById(id) {
    return await prisma.class.findUnique({
      where: { id },
      include: { schedules: true }
    });
  }
}

module.exports = new ClassManagementService();
