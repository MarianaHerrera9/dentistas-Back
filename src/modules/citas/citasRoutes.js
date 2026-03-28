const router = require('express').Router();
const ctrl = require('./citasController');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkPermiso = require('../../middlewares/checkPermiso');

router.post('/', authMiddleware, ctrl.create);
router.get('/', authMiddleware, ctrl.listByDate);
router.get('/week', authMiddleware, ctrl.listByWeek);
router.get('/month', authMiddleware, ctrl.listByMonth);

router.patch('/:id/cancelar', authMiddleware, ctrl.cancelar);
router.patch('/:id/confirmar', authMiddleware, ctrl.confirmar);
router.patch('/:id/completar', authMiddleware, ctrl.completar);
router.patch('/:id/reagendar', authMiddleware, ctrl.reagendar);
router.patch('/:id/asistio', authMiddleware, ctrl.asistio);
router.patch('/:id/no-asistio', authMiddleware, ctrl.noAsistio);
router.put('/:id', authMiddleware, ctrl.update);

router.get('/paciente/:id_paciente', authMiddleware, ctrl.listByPaciente);

module.exports = router;