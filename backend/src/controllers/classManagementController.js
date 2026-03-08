const classManagementService = require('../services/classManagementService');

class ClassManagementController {
  async getAllClasses(req, res) {
    try {
      const classes = await classManagementService.getAllClasses();
      res.json({ classes });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getClassById(req, res) {
    try {
      const { id } = req.params;
      const classData = await classManagementService.getClassById(id);
      res.json({ class: classData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createClass(req, res) {
    try {
      const classData = await classManagementService.createClass(req.body);
      res.json({ class: classData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateClass(req, res) {
    try {
      const { id } = req.params;
      const classData = await classManagementService.updateClass(id, req.body);
      res.json({ class: classData });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteClass(req, res) {
    try {
      const { id } = req.params;
      await classManagementService.deleteClass(id);
      res.json({ message: 'Class deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ClassManagementController();
