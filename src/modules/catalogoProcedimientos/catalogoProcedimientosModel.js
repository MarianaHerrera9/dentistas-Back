const db = require('../../db/index');
const { eq } = require('drizzle-orm');
const { catalogoProcedimientos, preciosProcedimientos, insumosProcedimiento, productos } = require('../../db/schema');

const CatalogoProcedimientos = {

    async create(data) {
        return await db.transaction(async (tx) => {
            const [result] = await tx.insert(catalogoProcedimientos).values({
                idClinica: data.id_clinica,
                nombre: data.nombre,
                descripcion: data.descripcion ?? null,
                activo: data.activo ?? 1,
                color: data.color ?? '#00676E',
                costoPorPieza: data.costo_por_pieza ?? 1
            });

            const id_procedimiento = result.insertId;

            if (data.precio != null) {
                await tx.insert(preciosProcedimientos).values({
                    idCatalogoProcedimiento: id_procedimiento,
                    precio: data.precio
                });
            }

            // Guardar materiales vinculados
            if (data.materiales && Array.isArray(data.materiales)) {
                for (const mat of data.materiales) {
                    await tx.insert(insumosProcedimiento).values({
                        idCatalogoProcedimiento: id_procedimiento,
                        idProducto: mat.id_producto,
                        cantidad: mat.cantidad || 1
                    });
                }
            }

            return id_procedimiento;
        });
    },

    async findAll() {
        const rows = await db
            .select({
                id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
                id_clinica: catalogoProcedimientos.idClinica,
                nombre: catalogoProcedimientos.nombre,
                descripcion: catalogoProcedimientos.descripcion,
                activo: catalogoProcedimientos.activo,
                color: catalogoProcedimientos.color,
                costo_por_pieza: catalogoProcedimientos.costoPorPieza,
                precio: preciosProcedimientos.precio,
                insumo_id: insumosProcedimiento.idProducto,
                insumo_cantidad: insumosProcedimiento.cantidad,
                insumo_nombre: productos.nombre,
                insumo_unidad: productos.unidadMedida
            })
            .from(catalogoProcedimientos)
            .leftJoin(preciosProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, preciosProcedimientos.idCatalogoProcedimiento))
            .leftJoin(insumosProcedimiento, eq(catalogoProcedimientos.idCatalogoProcedimiento, insumosProcedimiento.idCatalogoProcedimiento))
            .leftJoin(productos, eq(insumosProcedimiento.idProducto, productos.idProducto))
            .orderBy(catalogoProcedimientos.nombre);

        return this._transformRows(rows);
    },

    async findById(id) {
        const rows = await db
            .select({
                id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
                id_clinica: catalogoProcedimientos.idClinica,
                nombre: catalogoProcedimientos.nombre,
                descripcion: catalogoProcedimientos.descripcion,
                activo: catalogoProcedimientos.activo,
                color: catalogoProcedimientos.color,
                costo_por_pieza: catalogoProcedimientos.costoPorPieza,
                precio: preciosProcedimientos.precio,
                insumo_id: insumosProcedimiento.idProducto,
                insumo_cantidad: insumosProcedimiento.cantidad,
                insumo_nombre: productos.nombre,
                insumo_unidad: productos.unidadMedida
            })
            .from(catalogoProcedimientos)
            .leftJoin(preciosProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, preciosProcedimientos.idCatalogoProcedimiento))
            .leftJoin(insumosProcedimiento, eq(catalogoProcedimientos.idCatalogoProcedimiento, insumosProcedimiento.idCatalogoProcedimiento))
            .leftJoin(productos, eq(insumosProcedimiento.idProducto, productos.idProducto))
            .where(eq(catalogoProcedimientos.idCatalogoProcedimiento, id));

        const results = this._transformRows(rows);
        return results[0];
    },

    async findByIdClinica(id_clinica) {
        const rows = await db
            .select({
                id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
                id_clinica: catalogoProcedimientos.idClinica,
                nombre: catalogoProcedimientos.nombre,
                descripcion: catalogoProcedimientos.descripcion,
                activo: catalogoProcedimientos.activo,
                color: catalogoProcedimientos.color,
                costo_por_pieza: catalogoProcedimientos.costoPorPieza,
                precio: preciosProcedimientos.precio,
                insumo_id: insumosProcedimiento.idProducto,
                insumo_cantidad: insumosProcedimiento.cantidad,
                insumo_nombre: productos.nombre,
                insumo_unidad: productos.unidadMedida
            })
            .from(catalogoProcedimientos)
            .leftJoin(preciosProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, preciosProcedimientos.idCatalogoProcedimiento))
            .leftJoin(insumosProcedimiento, eq(catalogoProcedimientos.idCatalogoProcedimiento, insumosProcedimiento.idCatalogoProcedimiento))
            .leftJoin(productos, eq(insumosProcedimiento.idProducto, productos.idProducto))
            .where(eq(catalogoProcedimientos.idClinica, id_clinica));

        return this._transformRows(rows);
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
                    color: data.color ?? '#00676E',
                    costoPorPieza: data.costo_por_pieza ?? 1
                })
                .where(eq(catalogoProcedimientos.idCatalogoProcedimiento, id));

            // Precio
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

            // Materiales
            if (data.materiales && Array.isArray(data.materiales)) {
                // Eliminar anteriores
                await tx
                    .delete(insumosProcedimiento)
                    .where(eq(insumosProcedimiento.idCatalogoProcedimiento, id));

                // Insertar nuevos
                for (const mat of data.materiales) {
                    await tx.insert(insumosProcedimiento).values({
                        idCatalogoProcedimiento: id,
                        idProducto: mat.id_producto,
                        cantidad: mat.cantidad || 1
                    });
                }
            }

            return result.affectedRows;
        });
    },

    async delete(id) {
        return await db.transaction(async (tx) => {
            await tx
                .delete(insumosProcedimiento)
                .where(eq(insumosProcedimiento.idCatalogoProcedimiento, id));

            await tx
                .delete(preciosProcedimientos)
                .where(eq(preciosProcedimientos.idCatalogoProcedimiento, id));

            const [result] = await tx
                .delete(catalogoProcedimientos)
                .where(eq(catalogoProcedimientos.idCatalogoProcedimiento, id));

            return result.affectedRows;
        });
    },

    _transformRows(rows) {
        const map = new Map();
        for (const row of rows) {
            if (!map.has(row.id_catalogo_procedimiento)) {
                map.set(row.id_catalogo_procedimiento, {
                    ...row,
                    materiales: []
                });
            }
            if (row.insumo_id) {
                map.get(row.id_catalogo_procedimiento).materiales.push({
                    id_producto: row.insumo_id,
                    cantidad: row.insumo_cantidad,
                    producto_nombre: row.insumo_nombre,
                    producto_unidad: row.insumo_unidad
                });
            }
            // Limpiar campos de join de la raiz
            delete map.get(row.id_catalogo_procedimiento).insumo_id;
            delete map.get(row.id_catalogo_procedimiento).insumo_cantidad;
            delete map.get(row.id_catalogo_procedimiento).insumo_nombre;
            delete map.get(row.id_catalogo_procedimiento).insumo_unidad;
        }
        return Array.from(map.values());
    }

};

module.exports = CatalogoProcedimientos;
