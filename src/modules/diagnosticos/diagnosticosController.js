const CatalogoDiagnosticosModel  = require('./diagnosticosModel');

const CatalogoDiagnosticosController = {

    getAll: async (req, res) => {
        try {
            const idClinica = req.user?.id_clinica;
            const data = await CatalogoDiagnosticosModel.findAll(idClinica);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error obteniendo diagnósticos" });
        }
    },

    getById: async (req, res) => {
        try {
            const diagnostico = await CatalogoDiagnosticosModel.findById(req.params.id);

            if (!diagnostico)
                return res.status(404).json({ message: "No encontrado" });

            res.json(diagnostico);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error obteniendo el diagnóstico" });
        }
    },

    create: async (req, res) => {
        try {
            const data = {
                ...req.body,
                id_clinica: req.body.id_clinica || req.user?.id_clinica
            };
            const id = await CatalogoDiagnosticosModel.create(data);
            res.json({ id, message: "Creado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error creando diagnóstico" });
        }
    },

    update: async (req, res) => {
        try {
            const data = {
                ...req.body,
                id_clinica: req.body.id_clinica || req.user?.id_clinica
            };
            await CatalogoDiagnosticosModel.update(req.params.id, data);
            res.json({ message: "Actualizado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error actualizando diagnóstico" });
        }
    },

    remove: async (req, res) => {
        try {
            await CatalogoDiagnosticosModel.remove(req.params.id);
            res.json({ message: "Eliminado correctamente" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error eliminando diagnóstico" });
        }
    }

};

module.exports = CatalogoDiagnosticosController;