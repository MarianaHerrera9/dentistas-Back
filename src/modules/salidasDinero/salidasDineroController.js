const SalidasDineroModel = require('./salidasDineroModel');

const SalidasDineroController = {
    createSalida: async (req, res) => {
        try {
            const { id_clinica } = req.body;
            // Validate user belongs to clinic
            if (req.user.id_clinica !== id_clinica) {
                return res.status(403).json({ error: 'No tienes permiso para registrar salidas en esta clínica' });
            }

            const insertId = await SalidasDineroModel.create(req.body);
            res.status(201).json({
                message: 'Salida de dinero registrada correctamente',
                id_salida: insertId
            });
        } catch (err) {
            console.error('Error en createSalida:', err);
            res.status(500).json({ error: 'Error al registrar la salida de dinero' });
        }
    },

    getSalidas: async (req, res) => {
        try {
            const { id_clinica } = req.params;
            const { fecha_inicio, fecha_fin } = req.query;

            if (req.user.id_clinica !== parseInt(id_clinica)) {
                return res.status(403).json({ error: 'No tienes permiso para ver las salidas de esta clínica' });
            }

            if (!fecha_inicio || !fecha_fin) {
                return res.status(400).json({ error: 'fecha_inicio y fecha_fin son requeridas' });
            }

            const salidas = await SalidasDineroModel.getByClinicaAndDateRange(id_clinica, fecha_inicio, fecha_fin);
            res.json(salidas);
        } catch (err) {
            console.error('Error en getSalidas:', err);
            res.status(500).json({ error: 'Error al obtener las salidas de dinero' });
        }
    },

    deleteSalida: async (req, res) => {
        try {
            const { id } = req.params;
            // Get id_clinica from user token to ensure they only delete from their clinic
            const id_clinica = req.user.id_clinica;

            const affectedRows = await SalidasDineroModel.delete(id, id_clinica);
            
            if (affectedRows === 0) {
                return res.status(404).json({ error: 'Salida de dinero no encontrada o no pertenece a tu clínica' });
            }

            res.json({ message: 'Salida de dinero eliminada correctamente' });
        } catch (err) {
            console.error('Error en deleteSalida:', err);
            res.status(500).json({ error: 'Error al eliminar la salida de dinero' });
        }
    }
};

module.exports = SalidasDineroController;
