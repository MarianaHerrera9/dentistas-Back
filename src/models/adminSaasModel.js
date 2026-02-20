const db = require('../config/db');

const AdminSaas = {
    async create(data) {
        const [result] = await db.execute(
            `INSERT INTO admins_saas (nombre, usuario, password_hash, id_rol, activo)
       VALUES (?, ?, ?, ?, 1)`,
            [data.nombre, data.usuario, data.password_hash, data.id_rol]
        );
        return result.insertId;
    },

    async findByUsuarioWithRol(usuario) {
        const [rows] = await db.execute(
            `
      SELECT a.*, r.nombre_rol
      FROM admins_saas a
      LEFT JOIN roles r ON r.id_rol = a.id_rol
      WHERE a.usuario = ? AND a.activo = 1
      `,
            [usuario]
        );
        return rows[0];
    }
};

module.exports = AdminSaas;
