const AgendaService = require('./agendaService');

exports.create = async (req, res, next) => {
    try {
        await AgendaService.createBlock(req.body);
        res.status(201).json({ message: 'Bloque creado' });
    } catch (err) {
        next(err);
    }
};

exports.list = async (req, res, next) => {
    try {
        const id_dentista = req.query.dentista ? parseInt(req.query.dentista) : null;
        const fetchAll = req.query.all === 'true';
        const [rows] = await AgendaService.getBlocks(req.params.id_clinica, id_dentista, fetchAll);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.bulkUpdate = async (req, res, next) => {
    try {
        const id_dentista = req.query.dentista ? parseInt(req.query.dentista) : null;
        await AgendaService.bulkUpdate(req.params.id_clinica, id_dentista, req.body.blocks);
        res.json({ message: 'Bloques actualizados' });
    } catch (err) {
        next(err);
    }
};
