const db = require('../../db/index');
const { eq, and, desc } = require('drizzle-orm');
const { archivosClinicas } = require('../../db/schema');

const guardarArchivo = async ({
    id_consulta,
    id_paciente,
    tipo,
    ruta_archivo,
    nombre_archivo,
    descripcion,
}) => {

    const idConsultaValue = id_consulta ?? null;
    const [result] = await db.insert(archivosClinicas).values({
        idConsulta: idConsultaValue,
        idPaciente: id_paciente,
        tipo: tipo,
        rutaArchivo: ruta_archivo,
        nombreArchivo: nombre_archivo,
        descripcion: descripcion
    });

    return result.insertId;
};

const obtenerArchivos = async ({ id_consulta, id_paciente }) => {
    const filters = [];

    if (id_consulta) {
        filters.push(eq(archivosClinicas.idConsulta, id_consulta));
    }

    if (id_paciente) {
        filters.push(eq(archivosClinicas.idPaciente, id_paciente));
    }

    const result = await db.select({
        id_archivo: archivosClinicas.idArchivo,
        id_consulta: archivosClinicas.idConsulta,
        id_paciente: archivosClinicas.idPaciente,
        tipo: archivosClinicas.tipo,
        nombre_archivo: archivosClinicas.nombreArchivo,
        descripcion: archivosClinicas.descripcion,
        fecha_subida: archivosClinicas.fechaSubida,
        ruta_archivo: archivosClinicas.rutaArchivo
    })
        .from(archivosClinicas)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .orderBy(desc(archivosClinicas.idArchivo));

    return result;
};

module.exports = {
    guardarArchivo,
    obtenerArchivos
};
