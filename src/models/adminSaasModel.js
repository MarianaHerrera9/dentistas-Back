const db = require('../db/index');
const { eq, and } = require('drizzle-orm');
const { adminsSaas, roles } = require('../db/schema');

const AdminSaas = {
    async create(data) {
        const [result] = await db.insert(adminsSaas).values({
            nombre: data.nombre,
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
                id_admin: adminsSaas.idAdmin,
                nombre: adminsSaas.nombre,
                usuario: adminsSaas.usuario,
                password_hash: adminsSaas.passwordHash,
                id_rol: adminsSaas.idRol,
                ultimo_acceso: adminsSaas.ultimoAcceso,
                activo: adminsSaas.activo,
                nombre_rol: roles.nombreRol
            })
            .from(adminsSaas)
            .leftJoin(roles, eq(roles.idRol, adminsSaas.idRol))
            .where(
                and(
                    eq(adminsSaas.usuario, usuario),
                    eq(adminsSaas.activo, 1)
                )
            );
        return result[0];
    }
};

module.exports = AdminSaas;
