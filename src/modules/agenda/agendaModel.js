const db = require('../../db/index');
const { eq, and } = require('drizzle-orm');
const { bloquesDisponibilidad } = require('../../db/schema');

const AgendaModel = {

    async createBlock(data) {
        const [result] = await db.insert(bloquesDisponibilidad).values({
            idClinica: data.id_clinica,
            diaSemana: data.dia_semana,
            horaInicio: data.hora_inicio,
            horaFin: data.hora_fin
        });
        return [result];
    },

    async getBlocksByClinic(id_clinica) {
        const result = await db
            .select({
                id_bloque: bloquesDisponibilidad.idBloque,
                id_clinica: bloquesDisponibilidad.idClinica,
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
