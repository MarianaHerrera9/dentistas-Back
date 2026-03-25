const express = require('express');
const router = express.Router();
const DashboardController = require('./dashboardController');

// Tareas de Recepción CRM
router.get('/reception-tasks/:id_clinica', DashboardController.getReceptionTasks);

// Métricas para Dentista y Administrador
router.get('/dentist-metrics/:id_clinica/:id_dentista', DashboardController.getDentistMetrics);
router.get('/admin-metrics/:id_clinica', DashboardController.getAdminMetrics);

// Rutas para Notas / Pendientes (Global)
router.get('/notes/:id_clinica/:id_usuario', DashboardController.getNotes);
router.post('/notes', DashboardController.createNote);
router.put('/notes/:id_nota', DashboardController.updateNote);
router.delete('/notes/:id_nota', DashboardController.deleteNote);

// Rutas para Tablero Kanban de Tareas (Pendientes)
router.get('/board-tasks/:id_clinica/:id_usuario', DashboardController.getBoardTasks);
router.post('/board-tasks', DashboardController.createBoardTask);
router.put('/board-tasks/:id_tarea', DashboardController.updateBoardTask);
router.put('/board-tasks/:id_tarea/status', DashboardController.updateBoardTaskStatus);
router.delete('/board-tasks/:id_tarea', DashboardController.deleteBoardTask);

module.exports = router;
