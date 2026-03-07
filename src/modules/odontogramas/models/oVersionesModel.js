const db = require('../../../db/index');
const { eq, sql } = require('drizzle-orm');
const { odontogramaVersiones } = require('../../../db/schema');

const OdontogramaVersion = {
    async getNextVersionNumber(id_odontograma) {
        const result = await db.select({
            version: sql`COALESCE(MAX(${odontogramaVersiones.numeroVersion}), 0) + 1`.mapWith(Number)
        })
            .from(odontogramaVersiones)
            .where(eq(odontogramaVersiones.idOdontograma, id_odontograma));

        return result[0]?.version || 1;
    },

    async create(data) {
        const {
            id_odontograma,
            numero_version,
            snapshot,
            creado_por
        } = data;

        await db.insert(odontogramaVersiones).values({
            idOdontograma: id_odontograma,
            numeroVersion: numero_version,
            snapshot: snapshot,
            creadoPor: creado_por
        });
    },

    async findByOdontograma(id_odontograma) {
        const result = await db.select()
            .from(odontogramaVersiones)
            .where(eq(odontogramaVersiones.idOdontograma, id_odontograma));
        return result;
    }
};

module.exports = OdontogramaVersion;
