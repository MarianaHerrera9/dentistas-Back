const express = require('express');
const router = express.Router();
const AusenciasController = require('./ausenciasController');
const authMiddleware = require('../../middlewares/authMiddleware');

const { checkOwnerOrAdmin } = AusenciasController;

/**
 * POST /ausencias
 * Crear una ausencia (vacaciones o no_disponibilidad).
 * Solo el propio doctor o un administrador pueden crearla.
 */
router.post(
    '/',
    authMiddleware,
    checkOwnerOrAdmin((req) => req.body.id_dentista),
    AusenciasController.create
);

/**
 * GET /ausencias/clinica/:id_clinica
 * Obtener todas las ausencias de la clínica (para el calendario general).
 * Query params opcionales: fecha_inicio, fecha_fin (YYYY-MM-DD)
 * Accesible por cualquier usuario autenticado de la clínica.
 */
router.get('/clinica/:id_clinica', authMiddleware, AusenciasController.getByClinica);

/**
 * GET /ausencias/dentista/:id_dentista
 * Obtener ausencias de un doctor específico.
 * Accesible por cualquier usuario autenticado.
 */
router.get('/dentista/:id_dentista', authMiddleware, AusenciasController.getByDentista);

/**
 * PUT /ausencias/:id_ausencia
 * Editar una ausencia existente.
 * Solo el propio doctor o un administrador pueden editarla.
 */
router.put(
    '/:id_ausencia',
    authMiddleware,
    async (req, res, next) => {
        // Primero obtenemos la ausencia para saber a qué dentista pertenece
        const AusenciasModel = require('./ausenciasModel');
        const ausencia = await AusenciasModel.getById(Number(req.params.id_ausencia));
        if (!ausencia) return res.status(404).json({ error: 'Ausencia no encontrada' });
        req._ausencia = ausencia;
        next();
    },
    checkOwnerOrAdmin((req) => req._ausencia?.idDentista),
    AusenciasController.update
);

/**
 * DELETE /ausencias/:id_ausencia
 * Eliminar una ausencia.
 * Solo el propio doctor o un administrador pueden eliminarla.
 */
router.delete(
    '/:id_ausencia',
    authMiddleware,
    async (req, res, next) => {
        const AusenciasModel = require('./ausenciasModel');
        const ausencia = await AusenciasModel.getById(Number(req.params.id_ausencia));
        if (!ausencia) return res.status(404).json({ error: 'Ausencia no encontrada' });
        req._ausencia = ausencia;
        next();
    },
    checkOwnerOrAdmin((req) => req._ausencia?.idDentista),
    AusenciasController.delete
);

module.exports = router;
