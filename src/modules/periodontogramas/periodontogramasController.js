const Service = require('./periodontogramaService');

const Controller = {

    async create(req, res) {
        try {

            const data = req.body;
            const result = await Service.create(data);

            res.status(201).json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {

        try {

            const { id } = req.params;
            const result = await Service.getById(id);

            if (!result) {
                return res.status(404).json({ error: 'Periodontograma no encontrado' });
            }

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    async delete(req, res) {

        try {

            const { id } = req.params;
            await Service.delete(id);

            res.json({ message: 'Periodontograma eliminado' });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    async getByPaciente(req, res) {

        try {

            const { idPaciente } = req.params;

            const result = await Service.getByPaciente(idPaciente);

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    async finalizar(req, res) {

        try {

            const { id } = req.params;

            const result = await Service.finalizar(id);

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    async createDetalle(req, res) {

        try {

            const { id } = req.params;

            const detalleId = await Service.createDetalle(id, req.body);

            res.status(201).json({ id_detalle: detalleId });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    async updateDetalle(req, res) {

        try {

            const { detalleId } = req.params;

            await Service.updateDetalle(detalleId, req.body);

            res.json({ message: 'Detalle actualizado' });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    async getDetalles(req, res) {

        try {

            const { id } = req.params;

            const result = await Service.getDetalles(id);

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    /**
     * Bulk save: guardar/actualizar todos los detalles de golpe
     * Body: { detalles: [ { numero_diente, cara, sondaje_m, ... }, ... ] }
     */
    async bulkSaveDetalles(req, res) {

        try {

            const { id } = req.params;
            const { detalles } = req.body;

            const result = await Service.bulkSaveDetalles(id, detalles);

            res.json({
                message: 'Detalles guardados correctamente',
                detalles: result
            });

        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    },

    /**
     * Estadísticas del periodontograma (medias de PS, NI, % placa, % sangrado)
     */
    async getEstadisticas(req, res) {

        try {

            const { id } = req.params;

            const result = await Service.getEstadisticas(id);

            res.json(result);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    },

    /**
     * Periodontograma completo: datos + detalles + estadísticas
     */
    async getCompleto(req, res) {

        try {

            const { id } = req.params;

            const result = await Service.getCompleto(id);

            res.json(result);

        } catch (error) {
            if (error.message === 'Periodontograma no encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }

    },

    /**
     * Exportar periodontograma como JSON
     */
    async exportar(req, res) {

        try {

            const { id } = req.params;

            const result = await Service.exportar(id);

            res.json(result);

        } catch (error) {
            if (error.message === 'Periodontograma no encontrado') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }

    }

};

module.exports = Controller;