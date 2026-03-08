const teacherManagementService = require('../services/teacherManagementService');

class TeacherManagementController {
  async getAllTeachers(req, res) {
    try {
      const teachers = await teacherManagementService.getAllTeachers();
      res.json({ teachers });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTeacherById(req, res) {
    try {
      const { id } = req.params;
      const teacher = await teacherManagementService.getTeacherById(id);
      res.json({ teacher });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createTeacher(req, res) {
    try {
      const teacher = await teacherManagementService.createTeacher(req.body);
      res.json({ teacher });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTeacher(req, res) {
    try {
      const { id } = req.params;
      const teacher = await teacherManagementService.updateTeacher(id, req.body);
      res.json({ teacher });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTeacher(req, res) {
    try {
      const { id } = req.params;
      await teacherManagementService.deleteTeacher(id);
      res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new TeacherManagementController();
