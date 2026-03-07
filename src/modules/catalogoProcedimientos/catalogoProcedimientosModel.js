const db = require('../../db/index');
const { eq } = require('drizzle-orm');
const { catalogoProcedimientos, preciosProcedimientos } = require('../../db/schema');

const CatalogoProcedimientos = {

    async create(data) {
        return await db.transaction(async (tx) => {
            const [result] = await tx.insert(catalogoProcedimientos).values({
                idClinica: data.id_clinica,
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                activo: data.activo ?? 1,
                color: data.color ?? '#00676E'
            });

            const id_procedimiento = result.insertId;

            if (data.precio != null) {
                await tx.insert(preciosProcedimientos).values({
                    idCatalogoProcedimiento: id_procedimiento,
                    precio: data.precio
                });
            }

            return id_procedimiento;
        });
    },

    async findAll() {
        const result = await db
            .select({
                id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
                id_clinica: catalogoProcedimientos.idClinica,
                nombre: catalogoProcedimientos.nombre,
                descripcion: catalogoProcedimientos.descripcion,
                activo: catalogoProcedimientos.activo,
                color: catalogoProcedimientos.color,
                precio: preciosProcedimientos.precio
            })
            .from(catalogoProcedimientos)
            .leftJoin(preciosProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, preciosProcedimientos.idCatalogoProcedimiento))
            .orderBy(catalogoProcedimientos.nombre);
        return result;
    },

    async findById(id) {
        const result = await db
            .select({
                id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
                id_clinica: catalogoProcedimientos.idClinica,
                nombre: catalogoProcedimientos.nombre,
                descripcion: catalogoProcedimientos.descripcion,
                activo: catalogoProcedimientos.activo,
                color: catalogoProcedimientos.color,
                precio: preciosProcedimientos.precio
            })
            .from(catalogoProcedimientos)
            .leftJoin(preciosProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, preciosProcedimientos.idCatalogoProcedimiento))
            .where(eq(catalogoProcedimientos.idCatalogoProcedimiento, id));
        return result[0];
    },

    async findByIdClinica(id_clinica) {
        const result = await db
            .select({
                id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
                id_clinica: catalogoProcedimientos.idClinica,
                nombre: catalogoProcedimientos.nombre,
                descripcion: catalogoProcedimientos.descripcion,
                activo: catalogoProcedimientos.activo,
                color: catalogoProcedimientos.color,
                precio: preciosProcedimientos.precio
            })
            .from(catalogoProcedimientos)
            .leftJoin(preciosProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, preciosProcedimientos.idCatalogoProcedimiento))
            .where(eq(catalogoProcedimientos.idClinica, id_clinica));
        return result;
    },

    async update(id, data) {
        return await db.transaction(async (tx) => {
            const [result] = await tx
                .update(catalogoProcedimientos)
                .set({
                    idClinica: data.id_clinica,
                    nombre: data.nombre,
                    descripcion: data.descripcion ?? null,
                    activo: data.activo ?? 1,
                    color: data.color ?? '#00676E'
                })
                .where(eq(catalogoProcedimientos.idCatalogoProcedimiento, id));

            if (data.precio != null) {
                const existing = await tx
                    .select({ id_precio: preciosProcedimientos.idPrecio })
                    .from(preciosProcedimientos)
                    .where(eq(preciosProcedimientos.idCatalogoProcedimiento, id));

                if (existing.length) {
                    await tx
                        .update(preciosProcedimientos)
                        .set({ precio: data.precio })
                        .where(eq(preciosProcedimientos.idCatalogoProcedimiento, id));
                } else {
                    await tx.insert(preciosProcedimientos).values({
                        idCatalogoProcedimiento: id,
                        precio: data.precio
                    });
                }
            }

            return result.affectedRows;
        });
    },

    async delete(id) {
        return await db.transaction(async (tx) => {
            await tx
                .delete(preciosProcedimientos)
                .where(eq(preciosProcedimientos.idCatalogoProcedimiento, id));

            const [result] = await tx
                .delete(catalogoProcedimientos)
                .where(eq(catalogoProcedimientos.idCatalogoProcedimiento, id));

            return result.affectedRows;
        });
    }

};

module.exports = CatalogoProcedimientos;
