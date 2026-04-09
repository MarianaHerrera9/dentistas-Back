const db = require('../../db/index');
const { eq, and, isNull, sql, desc, getTableColumns, not } = require('drizzle-orm');
const {
  pagos,
  cuotasTratamiento,
  planTratamiento,
  pacientes
} = require('../../db/schema');

const pagosCols = {
  id_pago: pagos.idPago,
  id_cuota: pagos.idCuota,
  id_paciente: pagos.idPaciente,
  id_plan: pagos.idPlan,
  id_clinica: pagos.idClinica,
  monto: pagos.monto,
  metodo_pago: pagos.metodoPago,
  fecha_pago: pagos.fechaPago,
  referencia: pagos.referencia,
  tipo_pago: pagos.tipoPago,
  nota: pagos.nota
};

const PagosModel = {

  create: async (data, connection = db) => {
    const {
      id_cuota,
      id_paciente,
      id_plan,
      id_clinica,
      monto,
      metodo_pago,
      fecha_pago,
      referencia,
      nota,
    } = data;

    const [result] = await connection.insert(pagos).values({
      idCuota: id_cuota || null,
      idPaciente: id_paciente,
      idPlan: id_plan || null,
      idClinica: id_clinica,
      monto: monto,
      metodoPago: metodo_pago,
      fechaPago: fecha_pago || new Date(),
      referencia: referencia || null,
      tipoPago: data.tipo_pago || 'Tratamiento',
      nota: nota || null
    });

    return result.insertId;
  },

  getAll: async () => {
    const result = await db.select({
      ...pagosCols,
      monto_cuota: cuotasTratamiento.monto,
      nombre_plan: planTratamiento.nombrePlan,
      nombre: pacientes.nombre,
      apellido_paterno: pacientes.apellidoPaterno,
      apellido_materno: pacientes.apellidoMaterno
    })
      .from(pagos)
      .leftJoin(cuotasTratamiento, eq(pagos.idCuota, cuotasTratamiento.idCuota))
      .leftJoin(planTratamiento, eq(pagos.idPlan, planTratamiento.idPlan))
      .leftJoin(pacientes, eq(pagos.idPaciente, pacientes.idPaciente));

    return result;
  },

  getById: async (id) => {
    const result = await db.select(pagosCols).from(pagos).where(eq(pagos.idPago, id));
    return result[0];
  },

  getByPacienteId: async (id_paciente) => {
    const result = await db.select({
      ...pagosCols,
      monto_cuota: cuotasTratamiento.monto,
      nombre_plan: planTratamiento.nombrePlan
    })
      .from(pagos)
      .leftJoin(cuotasTratamiento, eq(pagos.idCuota, cuotasTratamiento.idCuota))
      .leftJoin(planTratamiento, eq(pagos.idPlan, planTratamiento.idPlan))
      .where(eq(pagos.idPaciente, id_paciente))
      .orderBy(desc(pagos.fechaPago));

    return result;
  },

  getCuotasPendientes: async (id_paciente) => {
    const result = await db.select({
      id_cuota: cuotasTratamiento.idCuota,
      id_plan: cuotasTratamiento.idPlan,
      monto: cuotasTratamiento.monto,
      fecha_programada: cuotasTratamiento.fechaProgramada,
      pagada: cuotasTratamiento.pagada,
      saldo_favor: pacientes.saldoFavor,
      nombre_plan: planTratamiento.nombrePlan,
      tipo: sql`'Cuota'`
    })
      .from(cuotasTratamiento)
      .innerJoin(planTratamiento, eq(cuotasTratamiento.idPlan, planTratamiento.idPlan))
      .innerJoin(pacientes, eq(cuotasTratamiento.idPaciente, pacientes.idPaciente))
      .where(and(eq(cuotasTratamiento.idPaciente, id_paciente), eq(cuotasTratamiento.pagada, 0)));

    return result;
  },


  getPagosUnicosPendientes: async (id_paciente) => {
    const result = await db.select({
      id_plan: planTratamiento.idPlan,
      nombre_plan: planTratamiento.nombrePlan,
      monto_total: sql`COALESCE(NULLIF(${planTratamiento.costoAjustado}, 0), ${planTratamiento.costoTotalInicial})`,
      total_pagado: sql`COALESCE(SUM(${pagos.monto}), 0)`,
      monto: sql`COALESCE(NULLIF(${planTratamiento.costoAjustado}, 0), ${planTratamiento.costoTotalInicial}) - COALESCE(SUM(${pagos.monto}), 0)`,
      saldo_favor: pacientes.saldoFavor,
      tipo: sql`'Pago único'`
    })
      .from(planTratamiento)
      .innerJoin(pacientes, eq(planTratamiento.idPaciente, pacientes.idPaciente))
      .leftJoin(pagos, and(
        eq(planTratamiento.idPlan, pagos.idPlan),
        isNull(pagos.idCuota),
        not(eq(pagos.tipoPago, 'Anticipo'))
      ))
      .where(and(
        eq(planTratamiento.idPaciente, id_paciente),
        eq(planTratamiento.planPago, 'Pago único'),
        eq(planTratamiento.estado, 'En Progreso')
      ))
      .groupBy(planTratamiento.idPlan, planTratamiento.costoAjustado, planTratamiento.costoTotalInicial, pacientes.saldoFavor)
      .having(sql`COALESCE(SUM(${pagos.monto}), 0) < COALESCE(NULLIF(${planTratamiento.costoAjustado}, 0), ${planTratamiento.costoTotalInicial})`);

    return result;
  },

  getPagosRegistrados: async (id_paciente) => {
    const result = await db.select({
      id_pago: pagos.idPago,
      id_cuota: pagos.idCuota,
      id_plan: pagos.idPlan,
      monto: pagos.monto,
      fecha_pago: pagos.fechaPago,
      metodo_pago: pagos.metodoPago,
      cuota: sql`COALESCE(${cuotasTratamiento.idCuota}, 0)`.mapWith(Number),
      nombre_plan: planTratamiento.nombrePlan,
      tipo: pagos.tipoPago
    })
      .from(pagos)
      .leftJoin(cuotasTratamiento, eq(pagos.idCuota, cuotasTratamiento.idCuota))
      .leftJoin(planTratamiento, eq(pagos.idPlan, planTratamiento.idPlan))
      .where(eq(pagos.idPaciente, id_paciente));

    return result;
  },

  getPagosRegistradosPorClinica: async (id_clinica) => {
    const result = await db.select({
      id: pagos.idPago,
      id_plan: pagos.idPlan,
      nombre_plan: planTratamiento.nombrePlan,
      id_paciente: pagos.idPaciente,
      paciente: sql`CONCAT(${pacientes.nombre}, ' ', ${pacientes.apellidoPaterno}, ' ', IFNULL(${pacientes.apellidoMaterno}, ''))`,
      monto: pagos.monto,
      referencia: pagos.referencia,
      fecha: sql`DATE(${pagos.fechaPago})`,
      metodo_pago: pagos.metodoPago,
      tipo: pagos.tipoPago
    })
      .from(pagos)
      .leftJoin(planTratamiento, eq(planTratamiento.idPlan, pagos.idPlan))
      .innerJoin(pacientes, eq(pacientes.idPaciente, pagos.idPaciente))
      .where(eq(pagos.idClinica, id_clinica))
      .orderBy(desc(pagos.fechaPago));

    return result;
  },

  getCuotasPendientesPorClinica: async (id_clinica) => {
    const result = await db.select({
      id: cuotasTratamiento.idCuota,
      id_plan: cuotasTratamiento.idPlan,
      nombre_plan: planTratamiento.nombrePlan,
      id_paciente: cuotasTratamiento.idPaciente,
      paciente: sql`CONCAT(${pacientes.nombre}, ' ', ${pacientes.apellidoPaterno}, ' ', IFNULL(${pacientes.apellidoMaterno}, ''))`,
      saldo_favor: pacientes.saldoFavor,
      monto: cuotasTratamiento.monto,
      fecha: cuotasTratamiento.fechaProgramada,
      tipo: sql`'Cuota'`
    })
      .from(cuotasTratamiento)
      .innerJoin(planTratamiento, eq(planTratamiento.idPlan, cuotasTratamiento.idPlan))
      .innerJoin(pacientes, eq(pacientes.idPaciente, cuotasTratamiento.idPaciente))
      .where(and(eq(planTratamiento.idClinica, id_clinica), eq(cuotasTratamiento.pagada, 0)));

    return result;
  },

  getPagosUnicosPendientesPorClinica: async (id_clinica) => {
    const result = await db.select({
      id: planTratamiento.idPlan,
      id_plan: planTratamiento.idPlan,
      nombre_plan: planTratamiento.nombrePlan,
      id_paciente: planTratamiento.idPaciente,
      paciente: sql`CONCAT(${pacientes.nombre}, ' ', ${pacientes.apellidoPaterno}, ' ', IFNULL(${pacientes.apellidoMaterno}, ''))`,
      saldo_favor: pacientes.saldoFavor,
      total_pagado: sql`COALESCE(SUM(${pagos.monto}), 0)`,
      monto_total: sql`COALESCE(NULLIF(${planTratamiento.costoAjustado}, 0), ${planTratamiento.costoTotalInicial})`,
      monto: sql`COALESCE(NULLIF(${planTratamiento.costoAjustado}, 0), ${planTratamiento.costoTotalInicial}) - COALESCE(SUM(${pagos.monto}), 0)`,
      fecha: planTratamiento.fechaInicio,
      tipo: sql`'Pago único'`
    })
      .from(planTratamiento)
      .innerJoin(pacientes, eq(pacientes.idPaciente, planTratamiento.idPaciente))
      .leftJoin(pagos, and(
        eq(planTratamiento.idPlan, pagos.idPlan),
        isNull(pagos.idCuota),
        not(eq(pagos.tipoPago, 'Anticipo'))
      ))
      .where(and(
        eq(planTratamiento.idClinica, id_clinica),
        eq(planTratamiento.planPago, 'Pago único'),
        eq(planTratamiento.estado, 'En Progreso')
      ))
      .groupBy(planTratamiento.idPlan, pacientes.idPaciente, planTratamiento.costoAjustado, planTratamiento.costoTotalInicial)
      .having(sql`COALESCE(SUM(${pagos.monto}), 0) < COALESCE(NULLIF(${planTratamiento.costoAjustado}, 0), ${planTratamiento.costoTotalInicial})`);

    return result;
  },

  update: async (id, data) => {
    // Map logical keys to physical columns defined in schema
    const updateData = {};
    if (data.id_cuota !== undefined) updateData.idCuota = data.id_cuota;
    if (data.id_paciente !== undefined) updateData.idPaciente = data.id_paciente;
    if (data.id_plan !== undefined) updateData.idPlan = data.id_plan;
    if (data.id_clinica !== undefined) updateData.idClinica = data.id_clinica;
    if (data.monto !== undefined) updateData.monto = data.monto;
    if (data.metodo_pago !== undefined) updateData.metodoPago = data.metodo_pago;
    if (data.fecha_pago !== undefined) updateData.fechaPago = data.fecha_pago;
    if (data.referencia !== undefined) updateData.referencia = data.referencia;
    if (data.nota !== undefined) updateData.nota = data.nota;

    await db.update(pagos)
      .set(updateData)
      .where(eq(pagos.idPago, id));

    return PagosModel.getById(id);
  },

  delete: async (id) => {
    const [result] = await db.delete(pagos)
      .where(eq(pagos.idPago, id));

    return result.affectedRows;
  }

};

module.exports = PagosModel;
