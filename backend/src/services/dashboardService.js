const prisma = require('../config/prisma');

class DashboardService {
  async getStatistics() {
    const totalStudents = await prisma.student.count();
    const totalTeachers = await prisma.teacher.count();
    const totalUsers = await prisma.user.count();
    const pendingVerifications = await prisma.user.count({ where: { isVerified: false } });

    const feeTransactions = await prisma.feeTransaction.findMany({
      where: { type: 'deposit', status: 'completed' }
    });
    const totalFeeCollection = feeTransactions.reduce((sum, t) => sum + t.amount, 0);

    const students = await prisma.student.findMany({
      include: { attendance: true }
    });
    const totalAttendance = students.reduce((sum, s) => {
      const present = s.attendance.filter(a => a.status === 'present').length;
      const total = s.attendance.length;
      return sum + (total > 0 ? (present / total) * 100 : 0);
    }, 0);
    const averageAttendance = students.length > 0 ? totalAttendance / students.length : 0;

    return {
      totalStudents,
      totalTeachers,
      totalUsers,
      pendingVerifications,
      totalFeeCollection,
      averageAttendance: averageAttendance.toFixed(2)
    };
  }
}

module.exports = new DashboardService();
