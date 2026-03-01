const Tratamiento = require('./tratamientoModel');

exports.createTratamiento = async (req, res) => {
    try {
        const id_plan = await Tratamiento.create(req.body);

        res.status(201).json({
            mensaje: 'Plan de tratamiento creado',
            id_plan
        });

    } catch (error) {
        console.error("🔥 ERROR CREATE TRATAMIENTO:");
        console.error(error);

        res.status(500).json({
            mensaje: 'Error interno al crear tratamiento',
            error: error.message,
            sqlMessage: error.sqlMessage,
            code: error.code,
            errno: error.errno
        });
    }
};

exports.getTratamiento = async (req, res) => {
    try {
        const { id_plan } = req.params;
        const tratamiento = await Tratamiento.findById(id_plan);

        if (!tratamiento) {
            return res.status(404).json({ mensaje: 'Tratamiento no encontrado' });
        }

        res.json(tratamiento);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.getTratamientosPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params;
        const tratamientos = await Tratamiento.findByPaciente(id_paciente);
        res.json(tratamientos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.updateTratamiento = async (req, res) => {
    try {
        const { id_plan } = req.params;
        const result = await Tratamiento.update(id_plan, req.body);

        if (!result) {
            return res.status(404).json({ mensaje: 'Tratamiento no encontrado' });
        }

        res.json({ mensaje: 'Tratamiento actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.deleteTratamiento = async (req, res) => {
    try {
        const { id_plan } = req.params;
        const result = await Tratamiento.delete(id_plan);

        if (!result) {
            return res.status(404).json({ mensaje: 'Tratamiento no encontrado' });
        }

        res.json({ mensaje: 'Tratamiento eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno' });
    }
};
