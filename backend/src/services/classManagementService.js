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

  async createClass(data) {
    return await prisma.class.create({
      data: {
        name: data.name,
        grade: data.grade,
        teacherId: data.teacherId
      }
    });
  }

  async updateClass(id, data) {
    return await prisma.class.update({
      where: { id },
      data
    });
  }

  async deleteClass(id) {
    return await prisma.class.delete({
      where: { id }
    });
  }
}

module.exports = new ClassManagementService();
