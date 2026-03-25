const db = require('../../db/index');
const { eq, and, desc } = require('drizzle-orm');
const { trabajosLaboratorio, laboratoriosDirectorio } = require('./labSchema');
const { pacientes } = require('../../db/schema');

const LabWorkModel = {
  create: async (data) => {
    const [result] = await db.insert(trabajosLaboratorio).values({
      clinicId: data.clinicId,
      patientId: data.patientId,
      labId: data.labId,
      workType: data.workType,
      status: data.status || 'Enviado',
      sendDate: data.sendDate,
      expectedDate: data.expectedDate,
      cost: data.cost,
      notas: data.notas
    });
    return result.insertId;
  },

  findAllByClinic: async (clinicId) => {
    return await db
      .select({
        id: trabajosLaboratorio.id,
        clinicId: trabajosLaboratorio.clinicId,
        patientId: trabajosLaboratorio.patientId,
        labId: trabajosLaboratorio.labId,
        workType: trabajosLaboratorio.workType,
        status: trabajosLaboratorio.status,
        sendDate: trabajosLaboratorio.sendDate,
        expectedDate: trabajosLaboratorio.expectedDate,
        cost: trabajosLaboratorio.cost,
        notas: trabajosLaboratorio.notas,
        patientName: pacientes.nombre,
        patientPaternal: pacientes.apellidoPaterno,
        labName: laboratoriosDirectorio.nombre
      })
      .from(trabajosLaboratorio)
      .innerJoin(pacientes, eq(trabajosLaboratorio.patientId, pacientes.idPaciente))
      .innerJoin(laboratoriosDirectorio, eq(trabajosLaboratorio.labId, laboratoriosDirectorio.id))
      .where(eq(trabajosLaboratorio.clinicId, clinicId))
      .orderBy(desc(trabajosLaboratorio.id));
  },

  findById: async (id, clinicId) => {
    const result = await db
      .select({
        id: trabajosLaboratorio.id,
        clinicId: trabajosLaboratorio.clinicId,
        patientId: trabajosLaboratorio.patientId,
        labId: trabajosLaboratorio.labId,
        workType: trabajosLaboratorio.workType,
        status: trabajosLaboratorio.status,
        sendDate: trabajosLaboratorio.sendDate,
        expectedDate: trabajosLaboratorio.expectedDate,
        cost: trabajosLaboratorio.cost,
        notas: trabajosLaboratorio.notas
      })
      .from(trabajosLaboratorio)
      .where(
          and(
              eq(trabajosLaboratorio.id, id),
              eq(trabajosLaboratorio.clinicId, clinicId)
          )
      );
    return result[0];
  },

  update: async (id, clinicId, data) => {
    const [result] = await db
      .update(trabajosLaboratorio)
      .set({
        patientId: data.patientId,
        labId: data.labId,
        workType: data.workType,
        status: data.status,
        sendDate: data.sendDate,
        expectedDate: data.expectedDate,
        cost: data.cost,
        notas: data.notas
      })
      .where(
          and(
              eq(trabajosLaboratorio.id, id),
              eq(trabajosLaboratorio.clinicId, clinicId)
          )
      );
    return result.affectedRows;
  },

  updateStatus: async (id, clinicId, status) => {
    const [result] = await db
        .update(trabajosLaboratorio)
        .set({ status })
        .where(
            and(
                eq(trabajosLaboratorio.id, id),
                eq(trabajosLaboratorio.clinicId, clinicId)
            )
        );
      return result.affectedRows;
  },

  delete: async (id, clinicId) => {
    const [result] = await db
      .delete(trabajosLaboratorio)
      .where(
          and(
              eq(trabajosLaboratorio.id, id),
              eq(trabajosLaboratorio.clinicId, clinicId)
          )
      );
    return result.affectedRows;
  }
};

module.exports = LabWorkModel;
