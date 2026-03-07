const db = require('../../../db/index');
const OdontogramaProcedimiento = require('../models/oProcedimientosModel');
const MaterialUsado = require('../models/materialUsadoModel');

async function crearProcedimientoConMateriales(data) {
    return await db.transaction(async (tx) => {
        const procedimientoId = await OdontogramaProcedimiento.add(
            data.procedimiento,
            tx
        );

        for (const material of data.materiales) {
            await MaterialUsado.add(
                {
                    ...material,
                    id_odontograma_procedimiento: procedimientoId
                },
                tx
            );
        }

        return procedimientoId;
    });
}

module.exports = {
    crearProcedimientoConMateriales
};
