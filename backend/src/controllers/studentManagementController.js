const studentManagementService = require('../services/studentManagementService');

class StudentManagementController {
  async getAllStudents(req, res) {
    try {
      const students = await studentManagementService.getAllStudents();
      res.json({ students });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createStudent(req, res) {
    try {
      const student = await studentManagementService.createStudent(req.body);
      res.json({ student });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      const student = await studentManagementService.updateStudent(id, req.body);
      res.json({ student });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      await studentManagementService.deleteStudent(id);
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addGrade(req, res) {
    try {
      const { studentId } = req.params;
      const grade = await studentManagementService.addGrade(studentId, req.body);
      res.json({ grade });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addAttendance(req, res) {
    try {
      const { studentId } = req.params;
      const attendance = await studentManagementService.addAttendance(studentId, req.body);
      res.json({ attendance });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new StudentManagementController();
