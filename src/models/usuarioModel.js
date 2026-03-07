const db = require('../db/index');
const { eq, and, desc } = require('drizzle-orm');
const { usuariosLogin, roles } = require('../db/schema');

const Usuario = {
  async create(data) {
    const [result] = await db.insert(usuariosLogin).values({
      idClinica: data.id_clinica,
      idDentista: data.id_dentista,
      usuario: data.usuario,
      passwordHash: data.password_hash,
      idRol: data.id_rol,
      activo: 1
    });
    return result.insertId;
  },

  async findByUsuarioWithRol(usuario) {
    const result = await db
      .select({
        id_usuario: usuariosLogin.idUsuario,
        id_clinica: usuariosLogin.idClinica,
        id_dentista: usuariosLogin.idDentista,
        usuario: usuariosLogin.usuario,
        password_hash: usuariosLogin.passwordHash,
        id_rol: usuariosLogin.idRol,
        ultimo_acceso: usuariosLogin.ultimoAcceso,
        activo: usuariosLogin.activo,
        nombre_rol: roles.nombreRol
      })
      .from(usuariosLogin)
      .leftJoin(roles, eq(roles.idRol, usuariosLogin.idRol))
      .where(
        and(
          eq(usuariosLogin.usuario, usuario),
          eq(usuariosLogin.activo, 1)
        )
      );
    return result[0];
  },

  async findByClinica(id_clinica) {
    const result = await db
      .select({
        id_usuario: usuariosLogin.idUsuario,
        usuario: usuariosLogin.usuario,
        activo: usuariosLogin.activo,
        id_rol: usuariosLogin.idRol,
        nombre_rol: roles.nombreRol
      })
      .from(usuariosLogin)
      .leftJoin(roles, eq(roles.idRol, usuariosLogin.idRol))
      .where(eq(usuariosLogin.idClinica, id_clinica))
      .orderBy(desc(usuariosLogin.idUsuario));
    return result;
  },

  async update(id_usuario, data) {
    const [result] = await db
      .update(usuariosLogin)
      .set({
        usuario: data.usuario,
        idRol: data.id_rol
      })
      .where(eq(usuariosLogin.idUsuario, id_usuario));
    return result.affectedRows;
  },

  async activarUsuarios(id_usuario, activo) {
    const [result] = await db
      .update(usuariosLogin)
      .set({ activo })
      .where(eq(usuariosLogin.idUsuario, id_usuario));
    return result.affectedRows;
  }
};

module.exports = Usuario;
