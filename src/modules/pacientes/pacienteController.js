const Paciente = require('./pacienteModel');
const Odontograma = require('../odontogramas/models/odontogramaModel');

exports.createPaciente = async (req, res) => {
    try {
        const { id_clinica, nombre, apellido_paterno, apellido_materno, force } = req.body;

        // 🔎 Verificar duplicado
        if (!force) {
            const existente = await Paciente.existsByNombre(
                id_clinica,
                nombre,
                apellido_paterno,
                apellido_materno
            );

            if (existente) {
                return res.status(409).json({
                    duplicated: true,
                    message: 'Ya existe un paciente con ese nombre',
                });
            }
        }

        // 🟢 Crear paciente
        const nuevoPacienteId = await Paciente.create(req.body);

        const nuevoOdontogramaId = await Odontograma.create({
            id_clinica,
            id_paciente: nuevoPacienteId
        });

        res.status(201).json({
            message: 'Paciente creado correctamente',
            id_paciente: nuevoPacienteId,
            id_odontograma: nuevoOdontogramaId
        });

    } catch (error) {
        console.error('Error al crear paciente:', error);
        res.status(500).json({ error: 'Error interno al crear paciente' });
    }
};

exports.getPacienteById = async (req, res) => {
    try {
        const { id } = req.params;

        const paciente = await Paciente.findById(id);

        if (!paciente) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        res.json(paciente);
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        res.status(500).json({ error: 'Error interno al obtener paciente' });
    }
};

exports.getPacientesByClinica = async (req, res) => {
    try {
        const { id_clinica } = req.params;

        const pacientes = await Paciente.findByClinica(id_clinica);

        res.json(pacientes);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ error: 'Error interno al obtener pacientes' });
    }
};

exports.updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const filasAfectadas = await Paciente.update(id, req.body);

        if (filasAfectadas === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado o sin cambios' });
        }

        res.json({ message: 'Paciente actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ error: 'Error interno al actualizar paciente' });
    }
};

exports.deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const filasAfectadas = await Paciente.delete(id);

        if (filasAfectadas === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente desactivado correctamente' });
    } catch (error) {
        console.error('Error al desactivar paciente:', error);
        res.status(500).json({ error: 'Error interno al desactivar paciente' });
    }
};
