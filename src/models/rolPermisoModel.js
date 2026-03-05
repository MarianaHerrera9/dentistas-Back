const db = require('../db/index');
const { rolPermiso } = require('../db/schema');

const RolPermiso = {
  async assign(id_rol, id_permiso) {
    await db.insert(rolPermiso).values({
      idRol: id_rol,
      idPermiso: id_permiso
    });
  }
};

module.exports = RolPermiso;
