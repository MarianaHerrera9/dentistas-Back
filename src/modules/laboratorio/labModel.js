const db = require('../../db/index');
const { eq, and } = require('drizzle-orm');
const { laboratoriosDirectorio } = require('./labSchema');

const LabModel = {
  create: async (data) => {
    const [result] = await db.insert(laboratoriosDirectorio).values({
      clinicId: data.clinicId,
      nombre: data.nombre,
      telefono: data.telefono,
      direccion: data.direccion
    });
    return result.insertId;
  },

  findAllByClinic: async (clinicId) => {
    return await db
      .select()
      .from(laboratoriosDirectorio)
      .where(eq(laboratoriosDirectorio.clinicId, clinicId));
  },

  findById: async (id, clinicId) => {
    const result = await db
        .select()
        .from(laboratoriosDirectorio)
        .where(
            and(
                eq(laboratoriosDirectorio.id, id),
                eq(laboratoriosDirectorio.clinicId, clinicId)
            )
        );
    return result[0];
  },

  update: async (id, clinicId, data) => {
    const [result] = await db
      .update(laboratoriosDirectorio)
      .set({
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion
      })
      .where(
        and(
            eq(laboratoriosDirectorio.id, id),
            eq(laboratoriosDirectorio.clinicId, clinicId)
        )
      );
    return result.affectedRows;
  },

  delete: async (id, clinicId) => {
    const [result] = await db
      .delete(laboratoriosDirectorio)
      .where(
          and(
              eq(laboratoriosDirectorio.id, id),
              eq(laboratoriosDirectorio.clinicId, clinicId)
          )
      );
    return result.affectedRows;
  }
};

module.exports = LabModel;
