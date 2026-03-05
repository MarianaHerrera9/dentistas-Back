const db = require('../../../db/index');
const { eq, desc } = require('drizzle-orm');
const { odontogramas, odontogramaVersiones } = require('../../../db/schema');

const Odontograma = {
    async create(data, connection = db) {
        const { id_clinica, id_paciente } = data;

        const [result] = await connection.insert(odontogramas).values({
            idClinica: id_clinica,
            idPaciente: id_paciente,
            version: 1,
            estado: 'Activo'
        });

        return result.insertId;
    },

    async findByPaciente(id_paciente) {
        const result = await db.select({
            id_odontograma: odontogramas.idOdontograma,
            id_clinica: odontogramas.idClinica,
            id_paciente: odontogramas.idPaciente,
            version: odontogramas.version,
            estado: odontogramas.estado,
            fecha_creacion: odontogramas.fechaCreacion,
            fecha_actualizacion: odontogramas.fechaActualizacion,
            nota_cierre: odontogramas.notaCierre
        })
            .from(odontogramas)
            .where(eq(odontogramas.idPaciente, id_paciente))
            .orderBy(desc(odontogramas.fechaCreacion));
        return result;
    },

    async findById(id_odontograma) {
        const result = await db.select({
            id_odontograma: odontogramas.idOdontograma,
            id_clinica: odontogramas.idClinica,
            id_paciente: odontogramas.idPaciente,
            version: odontogramas.version,
            estado: odontogramas.estado,
            fecha_creacion: odontogramas.fechaCreacion,
            fecha_actualizacion: odontogramas.fechaActualizacion,
            nota_cierre: odontogramas.notaCierre
        })
            .from(odontogramas)
            .where(eq(odontogramas.idOdontograma, id_odontograma));
        return result[0];
    },

    async update(id_odontograma, data) {
        const { nota_cierre, estado } = data;

        await db.update(odontogramas)
            .set({
                notaCierre: nota_cierre ?? null,
                estado: estado ?? 'Activo'
            })
            .where(eq(odontogramas.idOdontograma, id_odontograma));
    },

    async archive(id_odontograma) {
        const [result] = await db.update(odontogramas)
            .set({ estado: 'Archivado' })
            .where(eq(odontogramas.idOdontograma, id_odontograma));

        return result.affectedRows;
    },

    async archiveAndCreateNew(id_odontograma) {
        return await db.transaction(async (tx) => {
            // 1. Obtener odontograma actual
            const current = await tx.select({
                id_paciente: odontogramas.idPaciente,
                id_clinica: odontogramas.idClinica,
                version: odontogramas.version
            })
                .from(odontogramas)
                .where(eq(odontogramas.idOdontograma, id_odontograma));

            if (!current[0]) return null;

            // 2. Archivar
            await tx.update(odontogramas)
                .set({ estado: 'Archivado' })
                .where(eq(odontogramas.idOdontograma, id_odontograma));

            // 3. Crear nuevo odontograma
            const [result] = await tx.insert(odontogramas).values({
                idClinica: current[0].id_clinica,
                idPaciente: current[0].id_paciente,
                version: current[0].version + 1,
                estado: 'Activo'
            });

            return result.insertId;
        });
    },

    async archiveAndSnapshot(id_odontograma, snapshot, creado_por, nota_cierre) {
        return await db.transaction(async (tx) => {
            const current = await tx.select({
                id_paciente: odontogramas.idPaciente,
                id_clinica: odontogramas.idClinica,
                version: odontogramas.version
            })
                .from(odontogramas)
                .where(eq(odontogramas.idOdontograma, id_odontograma));

            if (!current[0]) return null;

            await tx.update(odontogramas)
                .set({
                    estado: 'Archivado',
                    notaCierre: nota_cierre
                })
                .where(eq(odontogramas.idOdontograma, id_odontograma));

            await tx.insert(odontogramaVersiones).values({
                idOdontograma: id_odontograma,
                numeroVersion: current[0].version,
                snapshot: snapshot,
                creadoPor: creado_por
            });

            const [result] = await tx.insert(odontogramas).values({
                idClinica: current[0].id_clinica,
                idPaciente: current[0].id_paciente,
                version: current[0].version + 1,
                estado: 'Activo'
            });

            return result.insertId;
        });
    }

};

module.exports = Odontograma;
