const db = require('../../config/db');

const guardarArchivo = async ({
                                  id_consulta,
                                  id_paciente,
                                  tipo,
                                  ruta_archivo,
                                  nombre_archivo,
                                  descripcion,
                              }) => {
    
    const idConsultaValue = id_consulta ?? null;
    const [result] = await db.query(
        `INSERT INTO archivos_clinicas
        (id_consulta, id_paciente, tipo, ruta_archivo, nombre_archivo, descripcion)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            idConsultaValue,
            id_paciente,
            tipo,
            ruta_archivo,
            nombre_archivo,
            descripcion,
        ]
    );

    return result.insertId;
};


const obtenerArchivos = async ({ id_consulta, id_paciente }) => {
    let query = 'SELECT * FROM archivos_clinicas WHERE 1=1';
    const params = [];

    if (id_consulta) {
        query += ' AND id_consulta = ?';
        params.push(id_consulta);
    }

    if (id_paciente) {
        query += ' AND id_paciente = ?';
        params.push(id_paciente);
    }

    query += ' ORDER BY id_archivo DESC';

    const [rows] = await db.query(query, params);
    return rows;
};
module.exports = {
    guardarArchivo,
    obtenerArchivos
};
