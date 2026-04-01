const db = require('../../db/index');
const { eq, and, between, sql, asc, desc, or } = require('drizzle-orm');
const { citas, pacientes, dentistas, catalogoProcedimientos, clinicas } = require('../../db/schema');

const CitasModel = {
    async create(data) {
        const [result] = await db.insert(citas).values({
            idClinica: data.id_clinica,
            idPaciente: data.id_paciente,
            idDentista: data.id_dentista,
            fechaCita: data.fecha_cita,
            horaInicio: data.hora_inicio,
            horaFin: data.hora_fin,
            idProcedimiento: data.id_procedimiento,
            notas: data.notas,
            estado: 'Pendiente',
            creadoPor: data.creado_por
        });
        return [result];
    },

    async getByDate(id_clinica, fecha) {
        const result = await db.select({
            id_cita: citas.idCita,
            id_clinica: citas.idClinica,
            id_paciente: citas.idPaciente,
            id_dentista: citas.idDentista,
            fecha_cita: citas.fechaCita,
            hora_inicio: citas.horaInicio,
            hora_fin: citas.horaFin,
            id_procedimiento: citas.idProcedimiento,
            notas: citas.notas,
            estado: citas.estado,
            creado_por: citas.creadoPor,

            paciente: pacientes.nombre,
            dentista: dentistas.nombre,
            procedimiento_id: catalogoProcedimientos.idCatalogoProcedimiento,
            procedimiento_nombre: catalogoProcedimientos.nombre,
            procedimiento_color: catalogoProcedimientos.color
        })
            .from(citas)
            .innerJoin(pacientes, eq(pacientes.idPaciente, citas.idPaciente))
            .innerJoin(dentistas, eq(dentistas.idDentista, citas.idDentista))
            .leftJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, citas.idProcedimiento))
            .where(
                and(
                    eq(citas.idClinica, id_clinica),
                    eq(citas.fechaCita, fecha)
                )
            )
            .orderBy(citas.horaInicio);

        return [result];
    },

    async getByWeek(id_clinica, start_date, end_date) {
        const result = await db.select({
            id_cita: citas.idCita,
            id_clinica: citas.idClinica,
            id_paciente: citas.idPaciente,
            id_dentista: citas.idDentista,
            fecha_cita: citas.fechaCita,
            hora_inicio: citas.horaInicio,
            hora_fin: citas.horaFin,
            id_procedimiento: citas.idProcedimiento,
            notas: citas.notas,
            estado: citas.estado,
            creado_por: citas.creadoPor,

            paciente: pacientes.nombre,
            dentista: dentistas.nombre,
            procedimiento_id: catalogoProcedimientos.idCatalogoProcedimiento,
            procedimiento_nombre: catalogoProcedimientos.nombre,
            procedimiento_color: catalogoProcedimientos.color
        })
            .from(citas)
            .innerJoin(pacientes, eq(pacientes.idPaciente, citas.idPaciente))
            .innerJoin(dentistas, eq(dentistas.idDentista, citas.idDentista))
            .leftJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, citas.idProcedimiento))
            .where(
                and(
                    eq(citas.idClinica, id_clinica),
                    between(citas.fechaCita, start_date, end_date)
                )
            )
            .orderBy(asc(citas.fechaCita), asc(citas.horaInicio));

        return [result];
    },

    async getByMonth(id_clinica, year, month) {
        const result = await db.select({
            id_cita: citas.idCita,
            id_clinica: citas.idClinica,
            id_paciente: citas.idPaciente,
            id_dentista: citas.idDentista,
            fecha_cita: citas.fechaCita,
            hora_inicio: citas.horaInicio,
            hora_fin: citas.horaFin,
            id_procedimiento: citas.idProcedimiento,
            notas: citas.notas,
            estado: citas.estado,
            creado_por: citas.creadoPor,

            paciente: pacientes.nombre,
            dentista: dentistas.nombre,
            procedimiento_id: catalogoProcedimientos.idCatalogoProcedimiento,
            procedimiento_nombre: catalogoProcedimientos.nombre,
            procedimiento_color: catalogoProcedimientos.color
        })
            .from(citas)
            .innerJoin(pacientes, eq(pacientes.idPaciente, citas.idPaciente))
            .innerJoin(dentistas, eq(dentistas.idDentista, citas.idDentista))
            .leftJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, citas.idProcedimiento))
            .where(
                and(
                    eq(citas.idClinica, id_clinica),
                    sql`YEAR(${citas.fechaCita}) = ${year}`,
                    sql`MONTH(${citas.fechaCita}) = ${month}`
                )
            )
            .orderBy(asc(citas.fechaCita), asc(citas.horaInicio));

        return [result];
    },

    async hasOverlap({ id_dentista, fecha_cita, hora_inicio, hora_fin }) {
        const result = await db.select({
            total: sql`COUNT(*)`.mapWith(Number)
        })
            .from(citas)
            .where(
                and(
                    eq(citas.idDentista, id_dentista),
                    eq(citas.fechaCita, fecha_cita),
                    or(eq(citas.estado, 'Pendiente'), eq(citas.estado, 'Confirmada')),
                    and(
                        sql`${citas.horaInicio} < ${hora_fin}`,
                        sql`${citas.horaFin} > ${hora_inicio}`
                    )
                )
            );
        return [result];
    },

    async updateStatus(id_cita, estado) {
        const [result] = await db.update(citas)
            .set({ estado })
            .where(eq(citas.idCita, id_cita));
        return [result];
    },

    async update(id_cita, data) {
        const [result] = await db.update(citas)
            .set({
                idDentista: data.id_dentista,
                fechaCita: data.fecha_cita,
                horaInicio: data.hora_inicio,
                horaFin: data.hora_fin,
                idProcedimiento: data.id_procedimiento,
                notas: data.notas
            })
            .where(eq(citas.idCita, id_cita));
        return [result];
    },


    async getByPaciente(id_paciente) {
        const result = await db.select({
            id_cita: citas.idCita,
            id_clinica: citas.idClinica,
            id_paciente: citas.idPaciente,
            id_dentista: citas.idDentista,
            fecha_cita: citas.fechaCita,
            hora_inicio: citas.horaInicio,
            hora_fin: citas.horaFin,
            id_procedimiento: citas.idProcedimiento,
            notas: citas.notas,
            estado: citas.estado,
            creado_por: citas.creadoPor,

            clinica: clinicas.nombre,
            dentista: dentistas.nombre
        })
            .from(citas)
            .innerJoin(clinicas, eq(clinicas.idClinica, citas.idClinica))
            .innerJoin(dentistas, eq(dentistas.idDentista, citas.idDentista))
            .where(eq(citas.idPaciente, id_paciente))
            .orderBy(desc(citas.fechaCita), desc(citas.horaInicio));

        return [result];
    }
};

module.exports = CitasModel;
