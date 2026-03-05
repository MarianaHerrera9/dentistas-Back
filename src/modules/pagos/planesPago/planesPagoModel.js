const db = require('../../../db/index');
const { eq, sql, desc, asc } = require('drizzle-orm');
const { planTratamiento, pacientes, cuotasTratamiento } = require('../../../db/schema');

const PlanesPagoModel = {
  async findByClinica(id_clinica) {
    const result = await db.select({
      id_plan: planTratamiento.idPlan,
      nombre_plan: planTratamiento.nombrePlan,
      fecha_inicio: planTratamiento.fechaInicio,
      costo_ajustado: planTratamiento.costoAjustado,
      estado: planTratamiento.estado,
      plan_pago: planTratamiento.planPago,
      id_paciente: planTratamiento.idPaciente,
      paciente: sql`CONCAT(${pacientes.nombre}, ' ', ${pacientes.apellidoPaterno}, ' ', IFNULL(${pacientes.apellidoMaterno}, ''))`,
      telefono: pacientes.telefono,
      correo: pacientes.correo,
      id_cuota: cuotasTratamiento.idCuota,
      monto: cuotasTratamiento.monto,
      fecha_programada: cuotasTratamiento.fechaProgramada,
      pagada: cuotasTratamiento.pagada
    })
      .from(planTratamiento)
      .innerJoin(pacientes, eq(pacientes.idPaciente, planTratamiento.idPaciente))
      .leftJoin(cuotasTratamiento, eq(cuotasTratamiento.idPlan, planTratamiento.idPlan))
      .where(eq(planTratamiento.idClinica, id_clinica))
      .orderBy(desc(planTratamiento.fechaInicio), asc(cuotasTratamiento.fechaProgramada));

    return result;
  },
};

module.exports = PlanesPagoModel;
