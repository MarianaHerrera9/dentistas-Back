const db = require('../../../db/index');
const { eq, desc } = require('drizzle-orm');
const { movimientosInventario, productos, lotesProductos } = require('../../../db/schema');

const MovimientosInventario = {
    async getByClinica(id_clinica) {
        const result = await db.select({
            id_movimiento: movimientosInventario.idMovimiento,
            id_producto: movimientosInventario.idProducto,
            id_clinica: movimientosInventario.idClinica,
            id_lote: movimientosInventario.idLote,
            tipo: movimientosInventario.tipo,
            cantidad: movimientosInventario.cantidad,
            motivo: movimientosInventario.motivo,
            fecha_movimiento: movimientosInventario.fechaMovimiento,
            nombre_producto: productos.nombre,
            unidad_medida: productos.unidadMedida,
            numero_lote: lotesProductos.numeroLote,
            fecha_caducidad: lotesProductos.fechaCaducidad
        })
            .from(movimientosInventario)
            .innerJoin(productos, eq(productos.idProducto, movimientosInventario.idProducto))
            .leftJoin(lotesProductos, eq(lotesProductos.idLote, movimientosInventario.idLote))
            .where(eq(movimientosInventario.idClinica, id_clinica))
            .orderBy(desc(movimientosInventario.fechaMovimiento));

        return result;
    },

    async getById(id_movimiento) {
        const result = await db.select({
            id_movimiento: movimientosInventario.idMovimiento,
            id_producto: movimientosInventario.idProducto,
            id_clinica: movimientosInventario.idClinica,
            id_lote: movimientosInventario.idLote,
            tipo: movimientosInventario.tipo,
            cantidad: movimientosInventario.cantidad,
            motivo: movimientosInventario.motivo,
            fecha_movimiento: movimientosInventario.fechaMovimiento,
            nombre_producto: productos.nombre,
            unidad_medida: productos.unidadMedida,
            numero_lote: lotesProductos.numeroLote,
            fecha_caducidad: lotesProductos.fechaCaducidad
        })
            .from(movimientosInventario)
            .innerJoin(productos, eq(productos.idProducto, movimientosInventario.idProducto))
            .leftJoin(lotesProductos, eq(lotesProductos.idLote, movimientosInventario.idLote))
            .where(eq(movimientosInventario.idMovimiento, id_movimiento));

        return result[0];
    },

    async getByIdProducto(id_producto) {
        const result = await db.select({
            id_movimiento: movimientosInventario.idMovimiento,
            id_producto: movimientosInventario.idProducto,
            id_clinica: movimientosInventario.idClinica,
            id_lote: movimientosInventario.idLote,
            tipo: movimientosInventario.tipo,
            cantidad: movimientosInventario.cantidad,
            motivo: movimientosInventario.motivo,
            fecha_movimiento: movimientosInventario.fechaMovimiento,
            nombre_producto: productos.nombre,
            numero_lote: lotesProductos.numeroLote,
            fecha_caducidad: lotesProductos.fechaCaducidad
        })
            .from(movimientosInventario)
            .innerJoin(productos, eq(productos.idProducto, movimientosInventario.idProducto))
            .leftJoin(lotesProductos, eq(lotesProductos.idLote, movimientosInventario.idLote))
            .where(eq(movimientosInventario.idProducto, id_producto))
            .orderBy(desc(movimientosInventario.fechaMovimiento));

        return result;
    },

    async create(data) {
        const {
            id_producto,
            id_clinica,
            id_lote,
            tipo,
            cantidad,
            motivo
        } = data;

        const [result] = await db.insert(movimientosInventario).values({
            idProducto: id_producto,
            idClinica: id_clinica,
            idLote: id_lote || null,
            tipo: tipo,
            cantidad: cantidad,
            motivo: motivo || null
        });

        return result.insertId;
    },

    async update(id, data) {
        const {
            id_producto,
            id_clinica,
            id_lote,
            tipo,
            cantidad,
            motivo
        } = data;

        await db.update(movimientosInventario)
            .set({
                idProducto: id_producto,
                idClinica: id_clinica,
                idLote: id_lote || null,
                tipo: tipo,
                cantidad: cantidad,
                motivo: motivo || null
            })
            .where(eq(movimientosInventario.idMovimiento, id));
    },

    async delete(id) {
        await db.delete(movimientosInventario).where(eq(movimientosInventario.idMovimiento, id));
    }
};

module.exports = MovimientosInventario;
