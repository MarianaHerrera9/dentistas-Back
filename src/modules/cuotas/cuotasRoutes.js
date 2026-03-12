const express = require('express');
const router = express.Router();
const CuotasController = require('./cuotasController');
const authMiddleware = require("../../middlewares/authMiddleware");
const checkPermiso = require("../../middlewares/checkPermiso");

router.get('/', authMiddleware, CuotasController.getCuotas);
router.get('/plan/:id_plan',authMiddleware, CuotasController.getCuotasByPlan);
router.get('/paciente/:id_paciente',authMiddleware,CuotasController.getCuotasByPaciente);
router.get('/:id_cuota',authMiddleware, CuotasController.getCuotaById);
router.post('/', authMiddleware,checkPermiso('permisos_clinica'),CuotasController.createCuota);
router.post('/bulk', authMiddleware,checkPermiso('permisos_clinica'),CuotasController.createManyCuotas);
router.put('/:id_cuota', authMiddleware,checkPermiso('permisos_clinica'),CuotasController.updateCuota);
router.delete('/:id_cuota',authMiddleware,checkPermiso('permisos_clinica'), CuotasController.deleteCuota);

module.exports = router;
