const db = require("../../../db/index");
const { eq, sql } = require("drizzle-orm");
const { lotesProductos, productos, stockActual } = require("../../../db/schema");

const LotesProductos = {

    async getByProducto(id_producto) {
        const result = await db.select({
            id_lote: lotesProductos.idLote,
            id_producto: lotesProductos.idProducto,
            id_clinica: lotesProductos.idClinica,
            numero_lote: lotesProductos.numeroLote,
            fecha_caducidad: lotesProductos.fechaCaducidad,
            cantidad_inicial: lotesProductos.cantidadInicial,
            fecha_creacion: lotesProductos.fechaCreacion,
            nombre_producto: productos.nombre,
            stock_lote: sql`COALESCE(${stockActual.stockDisponible}, 0)`.mapWith(Number)
        })
            .from(lotesProductos)
            .innerJoin(productos, eq(productos.idProducto, lotesProductos.idProducto))
            .leftJoin(stockActual, eq(stockActual.idLote, lotesProductos.idLote))
            .where(eq(lotesProductos.idProducto, id_producto));

        return result;
    },

    async getByClinica(id_clinica) {
        const result = await db.select({
            id_lote: lotesProductos.idLote,
            id_producto: lotesProductos.idProducto,
            id_clinica: lotesProductos.idClinica,
            numero_lote: lotesProductos.numeroLote,
            fecha_caducidad: lotesProductos.fechaCaducidad,
            cantidad_inicial: lotesProductos.cantidadInicial,
            fecha_creacion: lotesProductos.fechaCreacion,
            nombre_producto: productos.nombre,
            stock_lote: sql`COALESCE(${stockActual.stockDisponible}, 0)`.mapWith(Number)
        })
            .from(lotesProductos)
            .innerJoin(productos, eq(productos.idProducto, lotesProductos.idProducto))
            .leftJoin(stockActual, eq(stockActual.idLote, lotesProductos.idLote))
            .where(eq(lotesProductos.idClinica, id_clinica));

        return result;
    },

    async create(data) {
        const {
            id_producto,
            id_clinica,
            numero_lote,
            fecha_caducidad,
            cantidad_inicial
        } = data;

        const [result] = await db.insert(lotesProductos).values({
            idProducto: id_producto,
            idClinica: id_clinica,
            numeroLote: numero_lote,
            fechaCaducidad: fecha_caducidad,
            cantidadInicial: cantidad_inicial
        });

        return result.insertId;
    },

    async update(id_lote, data) {
        const {
            numero_lote,
            fecha_caducidad,
            cantidad_inicial
        } = data;

        await db.update(lotesProductos)
            .set({
                numeroLote: numero_lote,
                fechaCaducidad: fecha_caducidad,
                cantidadInicial: cantidad_inicial
            })
            .where(eq(lotesProductos.idLote, id_lote));
    },

    async remove(id_lote) {
        await db.delete(lotesProductos).where(eq(lotesProductos.idLote, id_lote));
    }
};

module.exports = LotesProductos;
