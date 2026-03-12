const db = require('../../db/index');
const { eq, asc } = require('drizzle-orm');
const { cuotasTratamiento, planTratamiento, pacientes } = require('../../db/schema');

const CuotasModel = {

    getAll: async () => {
        const result = await db.select({
            id_cuota: cuotasTratamiento.idCuota,
            id_plan: cuotasTratamiento.idPlan,
            id_paciente: cuotasTratamiento.idPaciente,
            monto: cuotasTratamiento.monto,
            fecha_programada: cuotasTratamiento.fechaProgramada,
            pagada: cuotasTratamiento.pagada,
            nombre_plan: planTratamiento.nombrePlan,
            nombre_paciente: pacientes.nombre,
            apellido_paterno: pacientes.apellidoPaterno,
            apellido_materno: pacientes.apellidoMaterno
        })
            .from(cuotasTratamiento)
            .leftJoin(planTratamiento, eq(planTratamiento.idPlan, cuotasTratamiento.idPlan))
            .leftJoin(pacientes, eq(pacientes.idPaciente, cuotasTratamiento.idPaciente))
            .orderBy(asc(cuotasTratamiento.fechaProgramada));
        return result;
    },

    getById: async (id_cuota) => {
        const result = await db.select({
            id_cuota: cuotasTratamiento.idCuota,
            id_plan: cuotasTratamiento.idPlan,
            id_paciente: cuotasTratamiento.idPaciente,
            monto: cuotasTratamiento.monto,
            fecha_programada: cuotasTratamiento.fechaProgramada,
            pagada: cuotasTratamiento.pagada
        })
            .from(cuotasTratamiento)
            .where(eq(cuotasTratamiento.idCuota, id_cuota));
        return result[0];
    },

    getByPlanId: async (id_plan) => {
        const result = await db.select({
            id_cuota: cuotasTratamiento.idCuota,
            id_plan: cuotasTratamiento.idPlan,
            id_paciente: cuotasTratamiento.idPaciente,
            monto: cuotasTratamiento.monto,
            fecha_programada: cuotasTratamiento.fechaProgramada,
            pagada: cuotasTratamiento.pagada
        })
            .from(cuotasTratamiento)
            .where(eq(cuotasTratamiento.idPlan, id_plan))
            .orderBy(asc(cuotasTratamiento.fechaProgramada));
        return result;
    },

    getByPacienteId: async (id_paciente) => {
        const result = await db.select({
            id_cuota: cuotasTratamiento.idCuota,
            id_plan: cuotasTratamiento.idPlan,
            id_paciente: cuotasTratamiento.idPaciente,
            monto: cuotasTratamiento.monto,
            fecha_programada: cuotasTratamiento.fechaProgramada,
            pagada: cuotasTratamiento.pagada,
            nombre_plan: planTratamiento.nombrePlan
        })
            .from(cuotasTratamiento)
            .leftJoin(planTratamiento, eq(planTratamiento.idPlan, cuotasTratamiento.idPlan))
            .where(eq(cuotasTratamiento.idPaciente, id_paciente))
            .orderBy(asc(cuotasTratamiento.fechaProgramada));
        return result;
    },

    create: async (data, connection = db) => {
        const { id_plan, id_paciente, monto, fecha_programada, pagada } = data;

        const [result] = await connection.insert(cuotasTratamiento).values({
            idPlan: id_plan,
            idPaciente: id_paciente,
            monto: monto,
            fechaProgramada: fecha_programada,
            pagada: pagada || 0
        });

        return CuotasModel.getById(result.insertId);
    },

    createMany: async (cuotas, connection = db) => {
        const values = cuotas.map(c => ({
            idPlan: c.id_plan,
            idPaciente: c.id_paciente,
            monto: c.monto,
            fechaProgramada: c.fecha_programada,
            pagada: 0,
        }));

        await connection.insert(cuotasTratamiento).values(values);
    },

    update: async (id_cuota, data) => {
        const { id_plan, id_paciente, monto, fecha_programada, pagada } = data;

        await db.update(cuotasTratamiento)
            .set({
                idPlan: id_plan,
                idPaciente: id_paciente,
                monto: monto,
                fechaProgramada: fecha_programada,
                pagada: pagada || 0
            })
            .where(eq(cuotasTratamiento.idCuota, id_cuota));

        return CuotasModel.getById(id_cuota);
    },

    marcarComoPagada: async (id_cuota, connection = db) => {
        await connection.update(cuotasTratamiento)
            .set({ pagada: 1 })
            .where(eq(cuotasTratamiento.idCuota, id_cuota));
    },

    delete: async (id_cuota) => {
        const [result] = await db.delete(cuotasTratamiento).where(eq(cuotasTratamiento.idCuota, id_cuota));
        return result.affectedRows;
    }

};

module.exports = CuotasModel;
