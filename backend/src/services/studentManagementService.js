const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class StudentManagementService {
  async getAllStudents() {
    return await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async createStudent(data) {
    return await prisma.student.create({
      data: {
        name: data.name,
        faculty: data.faculty,
        classId: data.classId,
        feeBalance: data.feeBalance || 0
      }
    });
  }

  async updateStudent(id, data) {
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.faculty) updateData.faculty = data.faculty;
    if (data.classId !== undefined) updateData.classId = data.classId;
    if (data.feeBalance !== undefined) updateData.feeBalance = data.feeBalance;
    
    return await prisma.student.update({
      where: { id: parseInt(id) },
      data: updateData
    });
  }

  async deleteStudent(id) {
    return await prisma.student.delete({
      where: { id: parseInt(id) }
    });
  }

  async addGrade(studentId, gradeData) {
    return await prisma.grade.create({
      data: {
        studentId: parseInt(studentId),
        subject: gradeData.subject,
        grade: gradeData.grade,
        marks: parseInt(gradeData.marks)
      }
    });
  }

  async addAttendance(studentId, attendanceData) {
    return await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        date: new Date(attendanceData.date),
        status: attendanceData.status
      }
    });
  }
}

module.exports = new StudentManagementService();
