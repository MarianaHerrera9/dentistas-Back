const express = require('express');
const presupuestoController = require('./presupuestoController');
const authMiddleware = require('../../middlewares/authMiddleware');
// Opcional: chequeo de permisos, si existiera uno como checkPermiso('permisos_tratamientos')
// const checkPermiso = require("../../middlewares/checkPermiso");
const router = express.Router();

router.post('/', authMiddleware, presupuestoController.createPresupuesto);
router.get('/:id_presupuesto', authMiddleware, presupuestoController.getPresupuesto);
router.get('/paciente/:id_paciente', authMiddleware, presupuestoController.getPresupuestosPaciente);
router.put('/:id_presupuesto', authMiddleware, presupuestoController.updatePresupuesto);
router.put('/:id_presupuesto/status', authMiddleware, presupuestoController.updateStatus);
router.post('/:id_presupuesto/accept', authMiddleware, presupuestoController.acceptPresupuesto);
router.delete('/:id_presupuesto', authMiddleware, presupuestoController.deletePresupuesto);

module.exports = router;
