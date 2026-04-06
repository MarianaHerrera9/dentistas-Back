const express = require('express');
const DentistaController = require('./dentistasController');
const authMiddleware = require("../../middlewares/authMiddleware");
const checkPermiso = require("../../middlewares/checkPermiso");
const router = express.Router();

router.get('/:id_clinica', authMiddleware, DentistaController.getAllByClinica);
router.get('/id/:id', authMiddleware, DentistaController.getById);
router.post('/', authMiddleware,checkPermiso('permisos_clinica'), DentistaController.create);
router.put('/:id', authMiddleware,checkPermiso('permisos_clinica'), DentistaController.update);
router.patch('/:id/status', authMiddleware,checkPermiso('permisos_clinica'), DentistaController.inactivarDentista);
router.post('/con-usuario', authMiddleware, checkPermiso('permisos_clinica'), DentistaController.createConUsuario);

module.exports = router;
