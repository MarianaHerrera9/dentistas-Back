const db = require('../../db/index');
const { eq, and, gte, lte, sql, or } = require('drizzle-orm');
const { ausenciasDentistas, dentistas } = require('../../db/schema');

const AusenciasModel = {

    /**
     * Crear una nueva ausencia (vacaciones o no_disponibilidad).
     */
    create: async (data) => {
        const {
            id_clinica,
            id_dentista,
            tipo,
            fecha_inicio,
            fecha_fin,
            hora_inicio = null,
            hora_fin = null,
            motivo = null,
            creado_por = null,
        } = data;

        const [result] = await db.insert(ausenciasDentistas).values({
            idClinica: id_clinica,
            idDentista: id_dentista,
            tipo,
            fechaInicio: fecha_inicio,
            fechaFin: fecha_fin,
            horaInicio: hora_inicio,
            horaFin: hora_fin,
            motivo,
            creadoPor: creado_por,
        });

        return result.insertId;
    },

    /**
     * Obtener todas las ausencias de una clínica con datos del dentista.
     * Soporta filtrado opcional por rango de fechas.
     */
    getByClinica: async (id_clinica, fecha_inicio = null, fecha_fin = null) => {
        const result = await db
            .select({
                id_ausencia: ausenciasDentistas.idAusencia,
                id_dentista: ausenciasDentistas.idDentista,
                nombre_dentista: sql`CONCAT(${dentistas.nombre}, ' ', IFNULL(${dentistas.apellidoPaterno}, ''))`,
                tipo: ausenciasDentistas.tipo,
                fecha_inicio: ausenciasDentistas.fechaInicio,
                fecha_fin: ausenciasDentistas.fechaFin,
                hora_inicio: ausenciasDentistas.horaInicio,
                hora_fin: ausenciasDentistas.horaFin,
                motivo: ausenciasDentistas.motivo,
                created_at: ausenciasDentistas.createdAt,
            })
            .from(ausenciasDentistas)
            .innerJoin(dentistas, eq(ausenciasDentistas.idDentista, dentistas.idDentista))
            .where(
                and(
                    eq(ausenciasDentistas.idClinica, id_clinica),
                    fecha_inicio ? gte(ausenciasDentistas.fechaFin, fecha_inicio) : undefined,
                    fecha_fin ? lte(ausenciasDentistas.fechaInicio, fecha_fin) : undefined
                )
            )
            .orderBy(ausenciasDentistas.fechaInicio);

        return result;
    },

    /**
     * Obtener todas las ausencias de un dentista específico.
     */
    getByDentista: async (id_dentista) => {
        const result = await db
            .select({
                id_ausencia: ausenciasDentistas.idAusencia,
                id_dentista: ausenciasDentistas.idDentista,
                tipo: ausenciasDentistas.tipo,
                fecha_inicio: ausenciasDentistas.fechaInicio,
                fecha_fin: ausenciasDentistas.fechaFin,
                hora_inicio: ausenciasDentistas.horaInicio,
                hora_fin: ausenciasDentistas.horaFin,
                motivo: ausenciasDentistas.motivo,
                created_at: ausenciasDentistas.createdAt,
            })
            .from(ausenciasDentistas)
            .where(eq(ausenciasDentistas.idDentista, id_dentista))
            .orderBy(ausenciasDentistas.fechaInicio);

        return result;
    },

    /**
     * Obtener una ausencia por su ID.
     */
    getById: async (id_ausencia) => {
        const result = await db
            .select()
            .from(ausenciasDentistas)
            .where(eq(ausenciasDentistas.idAusencia, id_ausencia));

        return result[0] || null;
    },

    /**
     * Actualizar una ausencia.
     */
    update: async (id_ausencia, data) => {
        const updateData = {};
        if (data.tipo !== undefined) updateData.tipo = data.tipo;
        if (data.fecha_inicio !== undefined) updateData.fechaInicio = data.fecha_inicio;
        if (data.fecha_fin !== undefined) updateData.fechaFin = data.fecha_fin;
        if (data.hora_inicio !== undefined) updateData.horaInicio = data.hora_inicio;
        if (data.hora_fin !== undefined) updateData.horaFin = data.hora_fin;
        if (data.motivo !== undefined) updateData.motivo = data.motivo;

        await db
            .update(ausenciasDentistas)
            .set(updateData)
            .where(eq(ausenciasDentistas.idAusencia, id_ausencia));

        return AusenciasModel.getById(id_ausencia);
    },

    /**
     * Eliminar una ausencia.
     */
    delete: async (id_ausencia) => {
        const [result] = await db
            .delete(ausenciasDentistas)
            .where(eq(ausenciasDentistas.idAusencia, id_ausencia));

        return result.affectedRows;
    },
};

module.exports = AusenciasModel;
