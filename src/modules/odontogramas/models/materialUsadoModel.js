const db = require('../../../db/index');
const { eq } = require('drizzle-orm');
const { materialesUsados, productos } = require('../../../db/schema');

const MaterialUsado = {
    async add(data, connection = db) {
        const {
            id_paciente,
            id_odontograma_procedimiento,
            id_producto,
            id_lote,
            cantidad,
            precio_unitario
        } = data;

        await connection.insert(materialesUsados).values({
            idPaciente: id_paciente,
            idOdontogramaProcedimiento: id_odontograma_procedimiento,
            idProducto: id_producto,
            idLote: id_lote || null,
            cantidad: cantidad,
            precioUnitario: precio_unitario
        });
    },

    async findByProcedimiento(id_odontograma_procedimiento) {
        const result = await db.select({
            id_material_usado: materialesUsados.idMaterialUsado,
            cantidad: materialesUsados.cantidad,
            precio_unitario: materialesUsados.precioUnitario,
            id_producto: productos.idProducto,
            producto_nombre: productos.nombre,
            producto_descripcion: productos.descripcion,
            unidad_medida: productos.unidadMedida,
            costo_unitario: productos.costoUnitario
        })
            .from(materialesUsados)
            .innerJoin(productos, eq(productos.idProducto, materialesUsados.idProducto))
            .where(eq(materialesUsados.idOdontogramaProcedimiento, id_odontograma_procedimiento));

        return result;
    }

};

module.exports = MaterialUsado;
