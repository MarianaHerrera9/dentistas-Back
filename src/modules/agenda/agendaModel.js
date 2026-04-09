const db = require('../../db/index');
const { eq, and, isNull } = require('drizzle-orm');
const { bloquesDisponibilidad } = require('../../db/schema');

const AgendaModel = {

    async createBlock(data) {
        const [result] = await db.insert(bloquesDisponibilidad).values({
            idClinica: data.id_clinica,
            idDentista: data.id_dentista || null,
            diaSemana: data.dia_semana,
            horaInicio: data.hora_inicio,
            horaFin: data.hora_fin
        });
        return [result];
    },

    async getBlocksByClinic(id_clinica) {
        // Keeping this for backwards compatibility, retrieving clinic general blocks
        return this.getBlocks(id_clinica, null);
    },

    async getBlocks(id_clinica, id_dentista = null, fetchAll = false) {
        let rows = [];

        if (fetchAll) {
            const result = await db
                .select({
                    id_bloque: bloquesDisponibilidad.idBloque,
                    id_clinica: bloquesDisponibilidad.idClinica,
                    id_dentista: bloquesDisponibilidad.idDentista,
                    dia_semana: bloquesDisponibilidad.diaSemana,
                    hora_inicio: bloquesDisponibilidad.horaInicio,
                    hora_fin: bloquesDisponibilidad.horaFin,
                    activo: bloquesDisponibilidad.activo
                })
                .from(bloquesDisponibilidad)
                .where(
                    and(
                        eq(bloquesDisponibilidad.idClinica, id_clinica),
                        eq(bloquesDisponibilidad.activo, 1)
                    )
                )
                .orderBy(bloquesDisponibilidad.diaSemana, bloquesDisponibilidad.horaInicio);
            return [result];
        }

        if (id_dentista) {
            const result = await db
                .select({
                    id_bloque: bloquesDisponibilidad.idBloque,
                    id_clinica: bloquesDisponibilidad.idClinica,
                    id_dentista: bloquesDisponibilidad.idDentista,
                    dia_semana: bloquesDisponibilidad.diaSemana,
                    hora_inicio: bloquesDisponibilidad.horaInicio,
                    hora_fin: bloquesDisponibilidad.horaFin,
                    activo: bloquesDisponibilidad.activo
                })
                .from(bloquesDisponibilidad)
                .where(
                    and(
                        eq(bloquesDisponibilidad.idClinica, id_clinica),
                        eq(bloquesDisponibilidad.idDentista, id_dentista),
                        eq(bloquesDisponibilidad.activo, 1)
                    )
                )
                .orderBy(bloquesDisponibilidad.diaSemana, bloquesDisponibilidad.horaInicio);
            
            rows = result;
        }

        // Si no se proveyó dentista, o si se proveyó pero no tiene horario personalizado
        if (!id_dentista || rows.length === 0) {
            const result = await db
            .select({
                id_bloque: bloquesDisponibilidad.idBloque,
                id_clinica: bloquesDisponibilidad.idClinica,
                id_dentista: bloquesDisponibilidad.idDentista,
                dia_semana: bloquesDisponibilidad.diaSemana,
                hora_inicio: bloquesDisponibilidad.horaInicio,
                hora_fin: bloquesDisponibilidad.horaFin,
                activo: bloquesDisponibilidad.activo
            })
            .from(bloquesDisponibilidad)
                .where(
                    and(
                        eq(bloquesDisponibilidad.idClinica, id_clinica),
                        isNull(bloquesDisponibilidad.idDentista),
                        eq(bloquesDisponibilidad.activo, 1)
                    )
                )
                .orderBy(bloquesDisponibilidad.diaSemana, bloquesDisponibilidad.horaInicio);
            
            rows = result;
        }

        return [rows];
    },

    async bulkUpdate(id_clinica, id_dentista, blocks) {
        const deleteCondition = id_dentista
            ? and(
                eq(bloquesDisponibilidad.idClinica, id_clinica),
                eq(bloquesDisponibilidad.idDentista, id_dentista)
            )
            : and(
                eq(bloquesDisponibilidad.idClinica, id_clinica),
                isNull(bloquesDisponibilidad.idDentista)
            );
        
        await db.delete(bloquesDisponibilidad).where(deleteCondition);

        if (blocks && blocks.length > 0) {
            const insertData = blocks.map(b => ({
                idClinica: id_clinica,
                idDentista: id_dentista || null,
                diaSemana: b.dia_semana,
                horaInicio: b.hora_inicio,
                horaFin: b.hora_fin
            }));
            await db.insert(bloquesDisponibilidad).values(insertData);
        }
        return true;
    },

    async updateBlock(id_bloque, data) {
        const [result] = await db
            .update(bloquesDisponibilidad)
            .set({
                horaInicio: data.hora_inicio,
                horaFin: data.hora_fin
            })
            .where(eq(bloquesDisponibilidad.idBloque, id_bloque));
        return [result];
    },

    async softDeleteBlock(id_bloque) {
        const [result] = await db
            .update(bloquesDisponibilidad)
            .set({ activo: 0 })
            .where(eq(bloquesDisponibilidad.idBloque, id_bloque));
        return [result];
    }

};

module.exports = AgendaModel;
