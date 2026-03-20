const express = require('express');
const router = express.Router();
const checkPermiso = require('../../middlewares/checkPermiso');
const authMiddleware = require('../../middlewares/authMiddleware');
const SalidasDineroController = require('./salidasDineroController');

// All routes are protected by authMiddleware
router.use(authMiddleware);

router.post('/', checkPermiso('permisos_clinica'), SalidasDineroController.createSalida);
router.get('/clinica/:id_clinica', checkPermiso('permisos_clinica'), SalidasDineroController.getSalidas);
router.delete('/:id', checkPermiso('permisos_clinica'), SalidasDineroController.deleteSalida);

module.exports = router;
