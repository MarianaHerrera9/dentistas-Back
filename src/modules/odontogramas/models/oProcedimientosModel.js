const db = require('../../../db/index');
const { eq, sql } = require('drizzle-orm');
const {
    odontogramaProcedimientos,
    planTratamientoProcedimientos,
    catalogoProcedimientos,
    dentistas,
    planTratamiento
} = require('../../../db/schema');

const OdontogramaProcedimiento = {
    async add(data, connection = db) {
        const {
            id_odontograma,
            id_dentista,
            id_plan,
            id_plan_tratamiento_procedimiento,
            id_diagnostico,
            descripcion
        } = data;

        const [result] = await connection.insert(odontogramaProcedimientos).values({
            idOdontograma: id_odontograma,
            idDentista: id_dentista,
            idPlan: id_plan,
            idPlanTratamientoProcedimiento: id_plan_tratamiento_procedimiento,
            idDiagnostico: id_diagnostico,
            descripcion: descripcion
        });

        // Actualizar el estado del procedimiento en el plan a 'Realizado'
        await connection.update(planTratamientoProcedimientos)
            .set({ status: 'Realizado' })
            .where(eq(planTratamientoProcedimientos.idProcedimiento, id_plan_tratamiento_procedimiento));

        return result.insertId; // ← id_odontograma_procedimiento
    },

    async findByOdontograma(id_odontograma) {
        const result = await db.select({
            id_odontograma_procedimiento: odontogramaProcedimientos.idOdontogramaProcedimiento,
            id_odontograma: odontogramaProcedimientos.idOdontograma,
            descripcion: odontogramaProcedimientos.descripcion,
            fecha_realizacion: odontogramaProcedimientos.fechaRealizacion,
            id_diagnostico: odontogramaProcedimientos.idDiagnostico,

            // Catálogo de procedimientos
            id_catalogo_procedimiento: catalogoProcedimientos.idCatalogoProcedimiento,
            procedimiento_nombre: catalogoProcedimientos.nombre,
            procedimiento_descripcion: catalogoProcedimientos.descripcion,

            // Procedimiento dentro del plan
            id_plan_tratamiento_procedimiento: planTratamientoProcedimientos.idProcedimiento,
            procedimiento_status: planTratamientoProcedimientos.status,
            procedimiento_cantidad: planTratamientoProcedimientos.cantidad,
            procedimiento_precio_unitario: planTratamientoProcedimientos.precioUnitario,

            // Dentista
            id_dentista: dentistas.idDentista,
            dentista_nombre: sql`CONCAT(${dentistas.nombre}, ' ', ${dentistas.apellidoPaterno}, ' ', IFNULL(${dentistas.apellidoMaterno}, ''))`,

            // Plan de tratamiento
            id_plan: planTratamiento.idPlan,
            plan_tratamiento_nombre: planTratamiento.nombrePlan
        })
            .from(odontogramaProcedimientos)
            .innerJoin(planTratamientoProcedimientos, eq(planTratamientoProcedimientos.idProcedimiento, odontogramaProcedimientos.idPlanTratamientoProcedimiento))
            .innerJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, planTratamientoProcedimientos.idCatalogoProcedimiento))
            .innerJoin(dentistas, eq(dentistas.idDentista, odontogramaProcedimientos.idDentista))
            .innerJoin(planTratamiento, eq(planTratamiento.idPlan, odontogramaProcedimientos.idPlan))
            .where(eq(odontogramaProcedimientos.idOdontograma, id_odontograma));

        return result;
    }

};

module.exports = OdontogramaProcedimiento;
