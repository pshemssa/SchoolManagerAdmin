const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const userManagementController = require('../controllers/userManagementController');
const dashboardController = require('../controllers/dashboardController');
const teacherManagementController = require('../controllers/teacherManagementController');
const classManagementController = require('../controllers/classManagementController');
const feeManagementController = require('../controllers/feeManagementController');
const adminAuthMiddleware = require('../middlewares/adminAuth');

// Auth routes
router.post('/login', adminAuthController.login);
router.post('/logout', adminAuthController.logout);

// User management routes
router.get('/users', adminAuthMiddleware, userManagementController.getAllUsers);
router.get('/users/pending', adminAuthMiddleware, userManagementController.getPendingVerifications);
router.put('/users/:userId/verify', adminAuthMiddleware, userManagementController.verifyUser);
router.put('/users/:userId/reject', adminAuthMiddleware, userManagementController.rejectUser);

// Dashboard routes
router.get('/dashboard/statistics', adminAuthMiddleware, dashboardController.getStatistics);

// Teacher routes
router.get('/teachers', adminAuthMiddleware, teacherManagementController.getAllTeachers);
router.get('/teachers/:id', adminAuthMiddleware, teacherManagementController.getTeacherById);

// Class routes
router.get('/classes', adminAuthMiddleware, classManagementController.getAllClasses);
router.get('/classes/:id', adminAuthMiddleware, classManagementController.getClassById);

// Fee routes
router.get('/fees/transactions', adminAuthMiddleware, feeManagementController.getAllTransactions);
router.get('/fees/transactions/:id', adminAuthMiddleware, feeManagementController.getTransactionById);

module.exports = router;
