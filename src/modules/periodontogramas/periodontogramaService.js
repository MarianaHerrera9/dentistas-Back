const Model = require('./periodontogramasModel');

const Service = {

    async create(data) {
        const id = await Model.create(data);
        return await Model.findById(id);
    },

    async getById(id) {
        return await Model.findById(id);
    },

    async delete(id) {
        await Model.delete(id);
    },

    async getByPaciente(idPaciente) {
        return await Model.findByPaciente(idPaciente);
    },

    async update(id, data) {
        await Model.update(id, data);
        return await Model.findById(id);
    },

    async finalizar(id, notas) {
        await Model.finalizar(id, notas);
        return await Model.findById(id);
    },

    async createDetalle(id, data) {
        return await Model.createDetalle(id, data);
    },

    async updateDetalle(detalleId, data) {
        await Model.updateDetalle(detalleId, data);
    },

    async getDetalles(id) {
        return await Model.getDetalles(id);
    },

    /**
     * Bulk save: guarda/actualiza todos los detalles de un periodontograma
     * Usa INSERT ... ON DUPLICATE KEY UPDATE por el constraint unique
     */
    async bulkSaveDetalles(id, detalles) {
        if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
            throw new Error('Se requiere un array de detalles');
        }

        // Validar que cada detalle tenga numero_diente y cara
        for (const d of detalles) {
            if (d.numero_diente === undefined || d.numero_diente === null) {
                throw new Error('Cada detalle debe tener numero_diente');
            }
            if (!d.cara || !['V', 'L'].includes(d.cara)) {
                throw new Error('Cada detalle debe tener cara (V o L)');
            }
        }

        await Model.bulkSaveDetalles(id, detalles);
        return await Model.getDetalles(id);
    },

    /**
     * Estadísticas SEPA:
     * - Media profundidad de sondaje
     * - Media nivel de inserción
     * - % Placa
     * - % Sangrado
     */
    async getEstadisticas(id) {
        return await Model.getEstadisticas(id);
    },

    /**
     * Obtener periodontograma completo con detalles + estadísticas
     */
    async getCompleto(id) {
        const periodontograma = await Model.findById(id);
        if (!periodontograma) {
            throw new Error('Periodontograma no encontrado');
        }

        const detalles = await Model.getDetalles(id);
        const estadisticas = await Model.getEstadisticas(id);

        return {
            ...periodontograma,
            detalles,
            estadisticas
        };
    },

    /**
     * Exportar: retorna JSON completo para descarga/importación
     */
    async exportar(id) {
        const periodontograma = await Model.findById(id);
        if (!periodontograma) {
            throw new Error('Periodontograma no encontrado');
        }

        const detalles = await Model.getDetalles(id);
        const estadisticas = await Model.getEstadisticas(id);

        return {
            version: '1.0',
            exportado_en: new Date().toISOString(),
            periodontograma: {
                id_periodontograma: periodontograma.id_periodontograma,
                id_clinica: periodontograma.id_clinica,
                id_paciente: periodontograma.id_paciente,
                id_dentista: periodontograma.id_dentista,
                fecha_registro: periodontograma.fecha_registro,
                estado: periodontograma.estado,
                notas: periodontograma.notas
            },
            detalles,
            estadisticas
        };
    }

};

module.exports = Service;