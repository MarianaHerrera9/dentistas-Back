const Presupuesto = require('./presupuestoModel');

exports.createPresupuesto = async (req, res) => {
    try {
        const id_presupuesto = await Presupuesto.create(req.body);

        res.status(201).json({
            mensaje: 'Presupuesto creado',
            id_presupuesto
        });
    } catch (error) {
        console.error("🔥 ERROR CREATE PRESUPUESTO:", error);

        res.status(500).json({
            mensaje: 'Error interno al crear presupuesto',
            error: error.message
        });
    }
};

exports.getPresupuesto = async (req, res) => {
    try {
        const { id_presupuesto } = req.params;
        const presupuesto = await Presupuesto.findById(id_presupuesto);

        if (!presupuesto) {
            return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
        }

        res.json(presupuesto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.getPresupuestosPaciente = async (req, res) => {
    try {
        const { id_paciente } = req.params;
        const presupuestos = await Presupuesto.findByPaciente(id_paciente);
        res.json(presupuestos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.updatePresupuesto = async (req, res) => {
    try {
        const { id_presupuesto } = req.params;
        await Presupuesto.update(id_presupuesto, req.body);
        res.json({ mensaje: 'Presupuesto actualizado correctamente' });
    } catch (error) {
        console.error("🔥 ERROR UPDATE PRESUPUESTO:", error);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id_presupuesto } = req.params;
        const { estado } = req.body;
        
        const result = await Presupuesto.updateStatus(id_presupuesto, estado);
        
        if (!result) {
            return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
        }
        
        res.json({ mensaje: 'Estado actulizado' });
    } catch (error) {
        console.error("🔥 ERROR UPDATE STATUS PRESUPUESTO:", error);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};

exports.acceptPresupuesto = async (req, res) => {
    try {
        const { id_presupuesto } = req.params;
        const data = await Presupuesto.accept(id_presupuesto);
        
        res.json({ 
            mensaje: 'Presupuesto aceptado, plan de tratamiento creado.',
            id_plan: data.id_plan 
        });
    } catch (error) {
        console.error("🔥 ERROR ACCEPT PRESUPUESTO:", error);
        res.status(500).json({ mensaje: 'Error interno', error: error.message });
    }
};

exports.deletePresupuesto = async (req, res) => {
    try {
        const { id_presupuesto } = req.params;
        const result = await Presupuesto.delete(id_presupuesto);

        if (!result) {
            return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
        }

        res.json({ mensaje: 'Presupuesto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno' });
    }
};
