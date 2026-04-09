const router = require('express').Router();
const ctrl = require('./agendaController');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkPermiso = require('../../middlewares/checkPermiso');

router.post('/', authMiddleware, checkPermiso('permisos_pacientes'), ctrl.create);
router.post('/:id_clinica/bulk', authMiddleware, ctrl.bulkUpdate);
router.get('/:id_clinica', authMiddleware, ctrl.list);

module.exports = router;
