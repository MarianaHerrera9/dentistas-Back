const MetricsModel = require('./metricsModel');

const MetricsController = {

    /**
     * GET /metrics/dashboard
     * Query params: id_clinica, fecha_inicio (YYYY-MM-DD), fecha_fin (YYYY-MM-DD)
     * Permiso requerido: administrar_clinica
     */
    getDashboard: async (req, res) => {
        const { id_clinica, fecha_inicio, fecha_fin } = req.query;

        // Validación de parámetros obligatorios
        if (!id_clinica || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                error: 'Se requieren los parámetros: id_clinica, fecha_inicio y fecha_fin',
            });
        }

        // Validar formato de fechas (YYYY-MM-DD)
        const reDate = /^\d{4}-\d{2}-\d{2}$/;
        if (!reDate.test(fecha_inicio) || !reDate.test(fecha_fin)) {
            return res.status(400).json({
                error: 'Las fechas deben tener el formato YYYY-MM-DD',
            });
        }

        if (fecha_inicio > fecha_fin) {
            return res.status(400).json({
                error: 'fecha_inicio no puede ser mayor que fecha_fin',
            });
        }

        const idClinicaInt = parseInt(id_clinica, 10);
        if (isNaN(idClinicaInt)) {
            return res.status(400).json({ error: 'id_clinica debe ser un número entero' });
        }

        try {
            // Ejecutar todas las queries en paralelo para mejor rendimiento
            const [
                pacientes_atendidos,
                consultas_realizadas,
                ingresos,
                egresos,
                canal_adquisicion,
            ] = await Promise.all([
                MetricsModel.getPacientesAtendidos(idClinicaInt, fecha_inicio, fecha_fin),
                MetricsModel.getConsultasRealizadas(idClinicaInt, fecha_inicio, fecha_fin),
                MetricsModel.getIngresos(idClinicaInt, fecha_inicio, fecha_fin),
                MetricsModel.getEgresos(idClinicaInt, fecha_inicio, fecha_fin),
                MetricsModel.getCanalAdquisicion(idClinicaInt, fecha_inicio, fecha_fin),
            ]);

            res.json({
                periodo: { fecha_inicio, fecha_fin },
                pacientes_atendidos,
                consultas_realizadas,
                ingresos,
                egresos,
                balance: ingresos - egresos,
                canal_adquisicion,
            });
        } catch (err) {
            console.error('[MetricsController.getDashboard]', err);
            res.status(500).json({ error: 'Error al obtener las métricas del dashboard' });
        }
    },
};

module.exports = MetricsController;
