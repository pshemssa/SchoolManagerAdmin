const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TeacherManagementService {
  async getAllTeachers() {
    return await prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTeacherById(id) {
    return await prisma.teacher.findUnique({
      where: { id }
    });
  }
}

module.exports = new TeacherManagementService();
