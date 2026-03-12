const db = require('../../db/index');
const { eq, or, isNull } = require('drizzle-orm');
const { catalogoDiagnosticos } = require('../../db/schema');

const CatalogoDiagnosticosModel = {

  findAll: async (idClinica = null) => {
    let query = db.select({
      id_diagnostico: catalogoDiagnosticos.idDiagnostico,
      nombre: catalogoDiagnosticos.nombre,
      tipo: catalogoDiagnosticos.tipo,
      color_icon: catalogoDiagnosticos.colorIcon,
      simbolo: catalogoDiagnosticos.simbolo,
      id_clinica: catalogoDiagnosticos.idClinica
    }).from(catalogoDiagnosticos);

    if (idClinica) {
      query.where(
        or(
          isNull(catalogoDiagnosticos.idClinica),
          eq(catalogoDiagnosticos.idClinica, idClinica)
        )
      );
    }

    const result = await query;
    return result;
  },

  findById: async (id) => {
    const result = await db.select({
      id_diagnostico: catalogoDiagnosticos.idDiagnostico,
      nombre: catalogoDiagnosticos.nombre,
      tipo: catalogoDiagnosticos.tipo,
      color_icon: catalogoDiagnosticos.colorIcon,
      simbolo: catalogoDiagnosticos.simbolo,
      id_clinica: catalogoDiagnosticos.idClinica
    }).from(catalogoDiagnosticos).where(eq(catalogoDiagnosticos.idDiagnostico, id));
    return result[0];
  },

  create: async (data) => {
    const { nombre, tipo, color_icon, simbolo, id_clinica } = data;

    const [result] = await db.insert(catalogoDiagnosticos).values({
      nombre: nombre,
      tipo: tipo,
      colorIcon: color_icon,
      simbolo: simbolo,
      idClinica: id_clinica
    });

    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, tipo, color_icon, simbolo, id_clinica } = data;

    await db.update(catalogoDiagnosticos)
      .set({
        nombre: nombre,
        tipo: tipo,
        colorIcon: color_icon,
        simbolo: simbolo,
        idClinica: id_clinica
      })
      .where(eq(catalogoDiagnosticos.idDiagnostico, id));

    return true;
  },

  remove: async (id) => {
    await db.delete(catalogoDiagnosticos).where(eq(catalogoDiagnosticos.idDiagnostico, id));
    return true;
  }
};

module.exports = CatalogoDiagnosticosModel;