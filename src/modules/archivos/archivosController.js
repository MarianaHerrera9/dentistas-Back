const path = require("path");
const { guardarArchivo, obtenerArchivos } = require("./archivosModel");

const subirArchivo = async (req, res) => {
    try {
        let { id_consulta, id_paciente, tipo, descripcion } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Archivo requerido" });
        }

        id_consulta = id_consulta && id_consulta !== '' ? Number(id_consulta) : null;

        const fileUrl = `/uploads/${file.filename}`;

        await guardarArchivo({
            id_consulta,
            id_paciente,
            tipo,
            ruta_archivo: fileUrl,
            nombre_archivo: file.originalname,
            descripcion,
        });

        res.json({
            message: "Archivo subido correctamente",
            url: fileUrl,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al subir archivo" });
    }
};

const listarArchivos = async (req, res) => {
    try {
        const { id_consulta, id_paciente } = req.query;
        const archivos = await obtenerArchivos({ id_consulta, id_paciente });

        res.json({ archivos });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener archivos" });
    }
};

module.exports = {
    subirArchivo,
    listarArchivos,
};