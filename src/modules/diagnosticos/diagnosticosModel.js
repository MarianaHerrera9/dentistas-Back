const db = require('../../db/index');
const { eq } = require('drizzle-orm');
const { catalogoDiagnosticos } = require('../../db/schema');

const CatalogoDiagnosticosModel = {

  findAll: async () => {
    const result = await db.select({
      id_diagnostico: catalogoDiagnosticos.idDiagnostico,
      nombre: catalogoDiagnosticos.nombre,
      tipo: catalogoDiagnosticos.tipo,
      color_icon: catalogoDiagnosticos.colorIcon,
      simbolo: catalogoDiagnosticos.simbolo
    }).from(catalogoDiagnosticos);
    return result;
  },

  findById: async (id) => {
    const result = await db.select({
      id_diagnostico: catalogoDiagnosticos.idDiagnostico,
      nombre: catalogoDiagnosticos.nombre,
      tipo: catalogoDiagnosticos.tipo,
      color_icon: catalogoDiagnosticos.colorIcon,
      simbolo: catalogoDiagnosticos.simbolo
    }).from(catalogoDiagnosticos).where(eq(catalogoDiagnosticos.idDiagnostico, id));
    return result[0];
  },

  create: async (data) => {
    const { nombre, tipo, color_icon, simbolo } = data;

    const [result] = await db.insert(catalogoDiagnosticos).values({
      nombre: nombre,
      tipo: tipo,
      colorIcon: color_icon,
      simbolo: simbolo
    });

    return result.insertId;
  },

  update: async (id, data) => {
    const { nombre, tipo, color_icon, simbolo } = data;

    await db.update(catalogoDiagnosticos)
      .set({
        nombre: nombre,
        tipo: tipo,
        colorIcon: color_icon,
        simbolo: simbolo
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