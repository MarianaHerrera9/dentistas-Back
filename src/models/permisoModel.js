const db = require('../db/index');
const { ne, eq } = require('drizzle-orm');
const { permisos, rolPermiso } = require('../db/schema');

const Permiso = {
  async getAllForClinica() {
    const result = await db
      .select()
      .from(permisos)
      .where(ne(permisos.nombre, 'gestionar_saas'));
    return result;
  },

  async getPermisosByRol(id_rol) {
    const result = await db
      .select({ nombre: permisos.nombre })
      .from(rolPermiso)
      .innerJoin(permisos, eq(permisos.idPermiso, rolPermiso.idPermiso))
      .where(eq(rolPermiso.idRol, id_rol));
    return result.map(r => r.nombre);
  }
};

module.exports = Permiso;
