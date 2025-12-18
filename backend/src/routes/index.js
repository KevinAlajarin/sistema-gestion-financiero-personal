const express = require('express');
const router = express.Router();

// Importación de rutas
const transactionRoutes = require('./transactionRoutes');
const categoryRoutes = require('./categoryRoutes');
const cardRoutes = require('./cardRoutes');
const budgetRoutes = require('./budgetRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const savingRoutes = require('./savingRoutes');
const reportRoutes = require('./reportRoutes');
const alertRoutes = require('./alertRoutes');
const salaryRoutes = require('./salaryRoutes');

// Asignación de rutas
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/cards', cardRoutes);
router.use('/budgets', budgetRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/savings', savingRoutes);
router.use('/reports', reportRoutes);
router.use('/alerts', alertRoutes);
router.use('/salary', salaryRoutes);

module.exports = router;