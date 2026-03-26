const Odontograma = require("./models/odontogramaModel");
const Diagnostico = require("./models/oDiagnosticosModel");
const VersionService = require("./services/oVersionServices");
const OdontogramaService = require("./services/odontogramaService");
const ProcedimientoService = require("./services/oProcedimientosServices");
const MaterialUsado = require("./models/materialUsadoModel");
const Procedimiento = require("./models/oProcedimientosModel");

const create = async (req, res) => {
    try {
        const id = await OdontogramaService.createNewOdontograma(req.body);
        res.status(201).json({ id });
    } catch (error) {
        console.error("Error creating odontograma:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const listByPaciente = async (req, res) => {
    try {
        const data = await Odontograma.findByPaciente(req.params.idPaciente);
        res.json(data);
    } catch (error) {
        console.error("Error listing odontogramas by paciente:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const getFull = async (req, res) => {
    try {
        const id = req.params.id;

        const odontograma = await Odontograma.findById(id);
        const diagnosticos = await Diagnostico.findByOdontograma(id);
        const procedimientos = await Procedimiento.findByOdontograma(id);

        for (const proc of procedimientos) {
            proc.materiales = await MaterialUsado.findByProcedimiento(
                proc.id_odontograma_procedimiento
            );
        }

        res.json({ odontograma, diagnosticos, procedimientos });
    } catch (error) {
        console.error("Error getting full odontograma:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const update = async (req, res) => {
    try {
        await Odontograma.update(req.params.id, req.body);
        res.json({ message: "Odontograma actualizado" });
    } catch (error) {
        console.error("Error updating odontograma:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const archive = async (req, res) => {
    try {
        const id = req.params.id;
        const { nota_cierre } = req.body;

        if (!nota_cierre || !nota_cierre.trim()) {
            return res.status(400).json({
                message: "La nota de cierre es obligatoria"
            });
        }

        // Obtener snapshot
        const odontograma = await Odontograma.findById(id);
        const diagnosticos = await Diagnostico.findByOdontograma(id);
        const procedimientos = await Procedimiento.findByOdontograma(id);

        for (const proc of procedimientos) {
            proc.materiales = await MaterialUsado.findByProcedimiento(
                proc.id_odontograma_procedimiento
            );
        }

        // Agregar nota al snapshot también
        odontograma.nota_cierre = nota_cierre;

        const snapshot = { odontograma, diagnosticos, procedimientos };

        const newId = await Odontograma.archiveAndSnapshot(
            id,
            snapshot,
            req.user?.idUsuario || null,
            nota_cierre
        );

        if (!newId) {
            return res.status(404).json({ message: "Odontograma no encontrado" });
        }

        res.json({
            message: "Odontograma cerrado correctamente",
            new_odontograma_id: newId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cerrar odontograma" });
    }
};

const addDiagnostico = async (req, res) => {
    try {
        await Diagnostico.add({
            ...req.body,
            id_odontograma: req.params.id
        });
        res.status(201).json({ message: "Diagnóstico agregado" });
    } catch (error) {
        console.error("Error adding diagnostico:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const deleteDiagnostico = async (req, res) => {
    try {
        await Diagnostico.delete(req.params.id);
        res.json({ message: "Diagnóstico eliminado" });
    } catch (error) {
        console.error("Error deleting diagnostico:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

const addProcedimiento = async (req, res) => {
    try {
        const procedimientoId =
            await ProcedimientoService.crearProcedimientoConMateriales({
                procedimiento: {
                    ...req.body.procedimiento,
                    id_odontograma: req.params.id
                },
                materiales: req.body.materiales || []
            });

        res.status(201).json({
            message: "Procedimiento agregado",
            id_procedimiento: procedimientoId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al registrar procedimiento"
        });
    }
};

const createVersion = async (req, res) => {
    try {
        const { snapshot } = req.body;
        const userId = req.user?.idUsuario || null; // por si no hay auth aún

        await VersionService.createSnapshotVersion(
            req.params.id,
            snapshot,
            userId
        );

        res.status(201).json({ message: "Versión creada" });
    } catch (error) {
        console.error("Error creating version:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

module.exports = {
    create,
    listByPaciente,
    getFull,
    update,
    archive,
    addDiagnostico,
    deleteDiagnostico,
    addProcedimiento,
    createVersion
};
