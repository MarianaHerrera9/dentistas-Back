const db = require("../../../db/index");
const Odontograma = require("../models/odontogramaModel");
const { eq, and } = require("drizzle-orm");
const { odontogramas } = require("../../../db/schema");

const OdontogramaService = {
    async createNewOdontograma(data) {
        const { id_paciente } = data;

        return await db.transaction(async (tx) => {
            await tx.update(odontogramas)
                .set({ estado: 'Archivado' })
                .where(
                    and(
                        eq(odontogramas.idPaciente, id_paciente),
                        eq(odontogramas.estado, 'Activo')
                    )
                );

            const odontogramaId = await Odontograma.create(data, tx);
            return odontogramaId;
        });
    }
};

module.exports = OdontogramaService;
