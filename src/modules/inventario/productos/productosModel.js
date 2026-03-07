const db = require("../../../db/index");
const { eq, and, sql, asc } = require("drizzle-orm");
const { productos, stockActual, lotesProductos } = require("../../../db/schema");

const prodCols = {
    id_producto: productos.idProducto,
    id_clinica: productos.idClinica,
    nombre: productos.nombre,
    descripcion: productos.descripcion,
    unidad_medida: productos.unidadMedida,
    costo_unitario: productos.costoUnitario,
    activo: productos.activo
};

const Productos = {

    async getByClinica(id_clinica) {
        const result = await db.select({
            id_producto: productos.idProducto,
            id_clinica: productos.idClinica,
            nombre: productos.nombre,
            descripcion: productos.descripcion,
            unidad_medida: productos.unidadMedida,
            costo_unitario: productos.costoUnitario,
            activo: productos.activo,
            stock_actual: sql`COALESCE(SUM(${stockActual.stockDisponible}), 0)`.mapWith(Number)
        })
            .from(productos)
            .leftJoin(stockActual, and(
                eq(stockActual.idProducto, productos.idProducto),
                eq(stockActual.idClinica, productos.idClinica)
            ))
            .where(and(eq(productos.idClinica, id_clinica), eq(productos.activo, 1)))
            .groupBy(productos.idProducto);

        return result;
    },

    async getById(id_producto) {
        const result = await db.select(prodCols).from(productos).where(eq(productos.idProducto, id_producto));
        return result[0];
    },

    async create(data) {
        const {
            id_clinica,
            nombre,
            descripcion,
            unidad_medida,
            costo_unitario
        } = data;

        const [result] = await db.insert(productos).values({
            idClinica: id_clinica,
            nombre: nombre,
            descripcion: descripcion,
            unidadMedida: unidad_medida,
            costoUnitario: costo_unitario,
            activo: 1
        });

        return result.insertId;
    },

    async update(id_producto, data) {
        const {
            nombre,
            descripcion,
            unidad_medida,
            costo_unitario,
            activo
        } = data;

        await db.update(productos)
            .set({
                nombre: nombre,
                descripcion: descripcion,
                unidadMedida: unidad_medida,
                costoUnitario: costo_unitario,
                activo: activo
            })
            .where(eq(productos.idProducto, id_producto));
    },

    async softDelete(id_producto) {
        await db.update(productos)
            .set({ activo: 0 })
            .where(eq(productos.idProducto, id_producto));
    },

    async getLowStock(id_clinica, limite = 10) {
        const result = await db.select({
            id_producto: productos.idProducto,
            nombre: productos.nombre,
            descripcion: productos.descripcion,
            unidad_medida: productos.unidadMedida,
            stock_actual: sql`SUM(${stockActual.stockDisponible})`.mapWith(Number),
            costo_unitario: productos.costoUnitario
        })
            .from(productos)
            .innerJoin(stockActual, and(
                eq(stockActual.idProducto, productos.idProducto),
                eq(stockActual.idClinica, productos.idClinica)
            ))
            .where(and(eq(productos.idClinica, id_clinica), eq(productos.activo, 1)))
            .groupBy(productos.idProducto)
            .having(sql`SUM(${stockActual.stockDisponible}) <= ${limite}`)
            .orderBy(sql`SUM(${stockActual.stockDisponible}) ASC`);

        return result;
    },

    async getExpiring(id_clinica, dias = 30) {
        const result = await db.select({
            id_producto: productos.idProducto,
            nombre: productos.nombre,
            id_lote: lotesProductos.idLote,
            numero_lote: lotesProductos.numeroLote,
            fecha_caducidad: lotesProductos.fechaCaducidad,
            stock_disponible: stockActual.stockDisponible,
            unidad_medida: productos.unidadMedida
        })
            .from(lotesProductos)
            .innerJoin(productos, eq(productos.idProducto, lotesProductos.idProducto))
            .innerJoin(stockActual, eq(stockActual.idLote, lotesProductos.idLote))
            .where(and(
                eq(lotesProductos.idClinica, id_clinica),
                eq(productos.activo, 1),
                sql`${stockActual.stockDisponible} > 0`,
                sql`${lotesProductos.fechaCaducidad} BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ${dias} DAY)`
            ))
            .orderBy(asc(lotesProductos.fechaCaducidad));

        return result;
    },

    async getDashboardStats(id_clinica, limite = 10, dias = 30) {

        // 🔹 TOTAL PRODUCTOS
        const totalResult = await db.select({
            total_productos: sql`COUNT(*)`.mapWith(Number)
        })
            .from(productos)
            .where(and(eq(productos.idClinica, id_clinica), eq(productos.activo, 1)));

        // 🔹 STOCK BAJO (por producto)
        const lowStockRows = await db.select({
            id_producto: productos.idProducto
        })
            .from(productos)
            .innerJoin(stockActual, and(
                eq(stockActual.idProducto, productos.idProducto),
                eq(stockActual.idClinica, productos.idClinica)
            ))
            .where(and(eq(productos.idClinica, id_clinica), eq(productos.activo, 1)))
            .groupBy(productos.idProducto)
            .having(sql`SUM(${stockActual.stockDisponible}) <= ${limite}`);

        // 🔹 PRODUCTOS POR CADUCAR
        const expiringResult = await db.select({
            productos_por_caducar: sql`COUNT(DISTINCT ${lotesProductos.idProducto})`.mapWith(Number)
        })
            .from(lotesProductos)
            .innerJoin(stockActual, eq(stockActual.idLote, lotesProductos.idLote))
            .where(and(
                eq(lotesProductos.idClinica, id_clinica),
                sql`${stockActual.stockDisponible} > 0`,
                sql`${lotesProductos.fechaCaducidad} BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ${dias} DAY)`
            ));

        // 🔹 VALOR TOTAL INVENTARIO
        const valorResult = await db.select({
            valor_total: sql`COALESCE(SUM(${stockActual.stockDisponible} * ${productos.costoUnitario}), 0)`.mapWith(Number)
        })
            .from(stockActual)
            .innerJoin(productos, eq(productos.idProducto, stockActual.idProducto))
            .where(and(eq(stockActual.idClinica, id_clinica), eq(productos.activo, 1)));

        return {
            total_productos: totalResult[0]?.total_productos || 0,
            productos_stock_bajo: lowStockRows.length,
            productos_por_caducar: expiringResult[0]?.productos_por_caducar || 0,
            valor_total: valorResult[0]?.valor_total || 0
        };
    }

};

module.exports = Productos;
