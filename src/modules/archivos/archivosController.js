const supabase = require("../../config/supabase");
const { guardarArchivo, obtenerArchivos } = require("./archivosModel");

const subirArchivo = async (req, res) => {
    try {
        let { id_consulta, id_paciente, tipo, descripcion } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Archivo requerido" });
        }
        id_consulta = id_consulta && id_consulta !== '' ? Number(id_consulta) : null;
        const filePath = `${Date.now()}-${file.originalname}`;

        // 1️⃣ SUBIR ARCHIVO
        const { error: uploadError } = await supabase.storage
            .from("archivos")
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
            });

        if (uploadError) throw uploadError;

        // 2️⃣ GUARDAR RUTA EN DB
        await guardarArchivo({
            id_consulta,
            id_paciente,
            tipo,
            ruta_archivo: filePath,
            nombre_archivo: file.originalname,
            descripcion,
        });

        res.json({
            message: "Archivo subido correctamente",
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

        const archivosConUrl = await Promise.all(
            archivos.map(async (archivo) => {
                const { data, error } = await supabase.storage
                    .from("archivos")
                    .createSignedUrl(archivo.ruta_archivo, 60 * 60); // 1 hora

                if (error) {
                    console.error(error);
                    return archivo;
                }

                return {
                    ...archivo,
                    url_archivo: data.signedUrl,
                };
            })
        );

        res.json({ archivos: archivosConUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener archivos" });
    }
};

module.exports = {
    subirArchivo,
    listarArchivos,
};