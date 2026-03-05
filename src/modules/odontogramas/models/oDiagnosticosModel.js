const db = require('../../../db/index');
const { eq } = require('drizzle-orm');
const { odontogramaDiagnosticos, catalogoDiagnosticos } = require('../../../db/schema');

const OdontogramaDiagnostico = {
    async add(data) {
        const {
            id_odontograma,
            id_catalogo_diagnostico,
            numero_diente,
            tipo_afectacion,   // 👈 NUEVO
            superficie,        // solo CORONA
            numero_raiz,       // solo RAIZ
            observaciones,
            otro
        } = data;

        await db.insert(odontogramaDiagnosticos).values({
            idOdontograma: id_odontograma,
            idCatalogoDiagnostico: id_catalogo_diagnostico,
            numeroDiente: numero_diente,
            tipoAfectacion: tipo_afectacion,
            superficie: superficie || null,
            numeroRaiz: numero_raiz || null,
            observaciones: observaciones,
            otro: otro
        });
    },

    async findByOdontograma(id_odontograma) {
        const result = await db.select({
            id_diente: odontogramaDiagnosticos.idDiente,
            numero_diente: odontogramaDiagnosticos.numeroDiente,
            tipo_afectacion: odontogramaDiagnosticos.tipoAfectacion,
            superficie: odontogramaDiagnosticos.superficie,
            numero_raiz: odontogramaDiagnosticos.numeroRaiz,
            observaciones: odontogramaDiagnosticos.observaciones,
            otro: odontogramaDiagnosticos.otro,
            fecha_actualizacion: odontogramaDiagnosticos.fechaActualizacion,
            nombre: catalogoDiagnosticos.nombre,
            tipo_diagnostico: catalogoDiagnosticos.tipo,
            color_icon: catalogoDiagnosticos.colorIcon,
            simbolo: catalogoDiagnosticos.simbolo
        })
            .from(odontogramaDiagnosticos)
            .innerJoin(catalogoDiagnosticos, eq(catalogoDiagnosticos.idDiagnostico, odontogramaDiagnosticos.idCatalogoDiagnostico))
            .where(eq(odontogramaDiagnosticos.idOdontograma, id_odontograma));

        return result;
    },

    async delete(id_diente) {
        await db.delete(odontogramaDiagnosticos).where(eq(odontogramaDiagnosticos.idDiente, id_diente));
    }
};

module.exports = OdontogramaDiagnostico;
