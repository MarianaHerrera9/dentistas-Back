const express = require('express');
const router = express.Router();
const Controller = require('./periodontogramasController');
const authMiddleware = require('../../middlewares/authMiddleware');

// CRUD periodontograma
router.post('/', authMiddleware, Controller.create);

// Por paciente (ruta estática antes de /:id)
router.get('/paciente/:idPaciente', authMiddleware, Controller.getByPaciente);

// Rutas con sub-recurso (antes de /:id para evitar conflictos)
// Periodontograma completo (datos + detalles + estadísticas)
router.get('/:id/completo', authMiddleware, Controller.getCompleto);

// Estadísticas (medias de PS, NI, % placa, % sangrado)
router.get('/:id/estadisticas', authMiddleware, Controller.getEstadisticas);

// Exportar JSON
router.get('/:id/exportar', authMiddleware, Controller.exportar);

// Detalles
router.get('/:id/detalles', authMiddleware, Controller.getDetalles);
router.post('/:id/detalles', authMiddleware, Controller.createDetalle);
router.put('/:id/detalles/bulk', authMiddleware, Controller.bulkSaveDetalles);
router.put('/:id/detalles/:detalleId', authMiddleware, Controller.updateDetalle);

// Finalizar
router.patch('/:id/finalizar', authMiddleware, Controller.finalizar);

// CRUD por ID (al final para no capturar rutas estáticas)
router.get('/:id', authMiddleware, Controller.getById);
router.delete('/:id', authMiddleware, Controller.delete);

module.exports = router;