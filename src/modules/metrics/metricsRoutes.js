const express = require('express');
const router = express.Router();
const MetricsController = require('./metricsController');
const authMiddleware = require('../../middlewares/authMiddleware');
const checkPermiso = require('../../middlewares/checkPermiso');

/**
 * GET /metrics/dashboard
 * Retorna el dashboard de métricas para un rango de fechas.
 *
 * Query params:
 *   - id_clinica  (number, required)
 *   - fecha_inicio (string YYYY-MM-DD, required)
 *   - fecha_fin    (string YYYY-MM-DD, required)
 *
 * Auth: Bearer JWT
 * Permiso: administrar_clinica
 */
router.get(
    '/dashboard',
    authMiddleware,
    checkPermiso('administrar_clinica'),
    MetricsController.getDashboard
);

module.exports = router;
