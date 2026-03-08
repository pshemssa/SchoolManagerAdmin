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

  async createTeacher(data) {
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha512').update(data.password).digest('hex');
    
    return await prisma.teacher.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        subject: data.subject
      }
    });
  }

  async updateTeacher(id, data) {
    return await prisma.teacher.update({
      where: { id },
      data
    });
  }

  async deleteTeacher(id) {
    return await prisma.teacher.delete({
      where: { id }
    });
  }
}

module.exports = new TeacherManagementService();
