const AgendaModel = require('./agendaModel');

const AgendaService = {

    async createBlock(data) {
        if (data.hora_inicio >= data.hora_fin) {
            throw new Error('La hora inicio debe ser menor a hora fin');
        }
        return AgendaModel.createBlock(data);
    },

    getBlocks(id_clinica, id_dentista, fetchAll = false) {
        return AgendaModel.getBlocks(id_clinica, id_dentista, fetchAll);
    },

    bulkUpdate(id_clinica, id_dentista, blocks) {
        return AgendaModel.bulkUpdate(id_clinica, id_dentista, blocks);
    },

    updateBlock(id, data) {
        return AgendaModel.updateBlock(id, data);
    },

    deleteBlock(id) {
        return AgendaModel.softDeleteBlock(id);
    }

};

module.exports = AgendaService;
