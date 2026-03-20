const db = require('../../db/index');
const { eq, and, between, desc } = require('drizzle-orm');
const { salidasDinero } = require('../../db/schema');

const salidasDineroCols = {
    id_salida: salidasDinero.idSalida,
    id_clinica: salidasDinero.idClinica,
    motivo: salidasDinero.motivo,
    monto: salidasDinero.monto,
    fecha_salida: salidasDinero.fechaSalida,
    hora_salida: salidasDinero.horaSalida,
    fecha_registro: salidasDinero.fechaRegistro
};

const SalidasDineroModel = {
    create: async (data, connection = db) => {
        const {
            id_clinica,
            motivo,
            monto,
            fecha_salida,
            hora_salida
        } = data;

        const [result] = await connection.insert(salidasDinero).values({
            idClinica: id_clinica,
            motivo: motivo,
            monto: monto,
            fechaSalida: fecha_salida,
            horaSalida: hora_salida
        });

        return result.insertId;
    },

    getByClinicaAndDateRange: async (id_clinica, startDate, endDate) => {
        const result = await db.select(salidasDineroCols)
            .from(salidasDinero)
            .where(
                and(
                    eq(salidasDinero.idClinica, id_clinica),
                    between(salidasDinero.fechaSalida, startDate, endDate)
                )
            )
            .orderBy(desc(salidasDinero.fechaSalida), desc(salidasDinero.horaSalida));

        return result;
    },

    delete: async (id_salida, id_clinica) => {
        const [result] = await db.delete(salidasDinero)
            .where(
                and(
                    eq(salidasDinero.idSalida, id_salida),
                    eq(salidasDinero.idClinica, id_clinica)
                )
            );

        return result.affectedRows;
    }
};

module.exports = SalidasDineroModel;
