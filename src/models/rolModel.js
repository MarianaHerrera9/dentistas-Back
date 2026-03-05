const db = require('../db/index');
const { eq } = require('drizzle-orm');
const { roles } = require('../db/schema');

const Rol = {
  async getAllForClinica(id_clinica) {
    const result = await db
      .select({
        id_rol: roles.idRol,
        nombre_rol: roles.nombreRol,
        descripcion: roles.descripcion
      })
      .from(roles)
      .where(eq(roles.idClinica, id_clinica));
    return result;
  },

  async create(data) {
    const [result] = await db.insert(roles).values({
      idClinica: data.id_clinica,
      nombreRol: data.nombre_rol,
      descripcion: data.descripcion
    });
    return result.insertId;
  }
};

module.exports = Rol;
