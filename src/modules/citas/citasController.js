const CitasService = require('./citasService');

exports.create = async (req, res, next) => {
    try {
        await CitasService.createCita(req.body);
        res.status(201).json({ message: 'Cita creada' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: 'Esta franja horaria ya está ocupada' });
        } else {
            next(err);
        }
    }
};

exports.listByDate = async (req, res, next) => {
    try {
        const { id_clinica, fecha } = req.query;
        const [rows] = await CitasService.getAgendaByDate(id_clinica, fecha);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.listByWeek = async (req, res, next) => {
    try {
        const { id_clinica, start_date, end_date } = req.query;
        const [rows] = await CitasService.getAgendaByWeek(id_clinica, start_date, end_date);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.listByMonth = async (req, res, next) => {
    try {
        const { id_clinica, year, month } = req.query;
        const [rows] = await CitasService.getAgendaByMonth(id_clinica, year, month);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

exports.cancelar = async (req, res, next) => {
    try {
        await CitasService.cancelar(req.params.id);
        res.json({ message: 'Cita cancelada' });
    } catch (err) {
        next(err);
    }
};

exports.confirmar = async (req, res, next) => {
    try {
        await CitasService.confirmar(req.params.id);
        res.json({ message: 'Cita confirmada' });
    } catch (err) {
        next(err);
    }
};

exports.completar = async (req, res, next) => {
    try {
        await CitasService.completar(req.params.id);
        res.json({ message: 'Cita completada' });
    } catch (err) {
        next(err);
    }
};

exports.asistio = async (req, res, next) => {
    try {
        await CitasService.asistio(req.params.id);
        res.json({ message: 'Cita asistida' });
    } catch (err) {
        next(err);
    }
};

exports.noAsistio = async (req, res, next) => {
    try {
        await CitasService.noAsistio(req.params.id);
        res.json({ message: 'Cita no asistida' });
    } catch (err) {
        next(err);
    }
};

exports.reagendar = async (req, res, next) => {
    try {
        await CitasService.reagendar(req.params.id, req.body);
        res.json({ message: 'Cita reagendada' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.update = async (req, res, next) => {
    try {
        await CitasService.update(req.params.id, req.body);
        res.json({ message: 'Cita actualizada' });
    } catch (err) {
        next(err);
    }
};


exports.listByPaciente = async (req, res, next) => {
    try {
        const { id_paciente } = req.params;
        const [rows] = await CitasService.getCitasByPaciente(id_paciente);
        res.json(rows);
    } catch (err) {
        next(err);
    }
};

