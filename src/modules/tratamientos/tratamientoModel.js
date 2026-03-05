const db = require('../../db/index');
const { eq, sql, inArray, desc } = require('drizzle-orm');
const {
    planTratamiento,
    planTratamientoProcedimientos,
    catalogoProcedimientos,
    preciosProcedimientos,
    pagos
} = require('../../db/schema');

const Tratamiento = {

    async create(data) {
        return await db.transaction(async (tx) => {
            const [result] = await tx.insert(planTratamiento).values({
                idClinica: data.id_clinica,
                idPaciente: data.id_paciente,
                idDentista: data.id_dentista,
                nombrePlan: data.nombre_plan ?? null,
                fechaInicio: data.fecha_inicio ?? null,
                fechaFinEstimada: data.fecha_fin_estimada ?? null,
                costoTotalInicial: data.costo_total_inicial ?? 0,
                costoAjustado: data.costo_ajustado ?? 0,
                razonAjuste: data.razon_ajuste ?? null,
                planPago: data.plan_pago ?? 'Pago único',
                estado: data.estado ?? 'En Progreso'
            });

            const id_plan = result.insertId;

            if (data.procedimientos?.length) {
                const procedimientosInsert = data.procedimientos.map(p => ({
                    idPlan: id_plan,
                    idClinica: data.id_clinica,
                    idPaciente: data.id_paciente,
                    idCatalogoProcedimiento: p.id_catalogo_procedimiento,
                    status: p.status ?? 'Pendiente',
                    cantidad: p.cantidad ?? 1,
                    precioUnitario: p.precio_unitario ?? 0
                }));

                await tx.insert(planTratamientoProcedimientos).values(procedimientosInsert);
            }

            return id_plan;
        });
    },

    async findById(id_plan) {
        const planRows = await db.select()
            .from(planTratamiento)
            .where(eq(planTratamiento.idPlan, id_plan));

        if (!planRows.length) return null;

        const plan = planRows[0];

        // Procedimientos
        const procRows = await db.select({
            id_procedimiento: planTratamientoProcedimientos.idProcedimiento,
            id_plan: planTratamientoProcedimientos.idPlan,
            id_catalogo_procedimiento: planTratamientoProcedimientos.idCatalogoProcedimiento,
            nombre: catalogoProcedimientos.nombre,
            descripcion: catalogoProcedimientos.descripcion,
            status: planTratamientoProcedimientos.status,
            cantidad: planTratamientoProcedimientos.cantidad,
            precio_unitario: planTratamientoProcedimientos.precioUnitario,
            precio_base: preciosProcedimientos.precio
        })
            .from(planTratamientoProcedimientos)
            .innerJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, planTratamientoProcedimientos.idCatalogoProcedimiento))
            .leftJoin(preciosProcedimientos, eq(preciosProcedimientos.idCatalogoProcedimiento, catalogoProcedimientos.idCatalogoProcedimiento))
            .where(eq(planTratamientoProcedimientos.idPlan, id_plan));

        plan.procedimientos = procRows;

        // Pagos
        const pagosRows = await db.select({
            total_pagado: sql`IFNULL(SUM(${pagos.monto}), 0)`.mapWith(Number)
        })
            .from(pagos)
            .where(eq(pagos.idPlan, id_plan));

        plan.total_pagado = pagosRows[0]?.total_pagado || 0;

        return plan;
    },

    async findByPaciente(id_paciente) {
        const plans = await db.select()
            .from(planTratamiento)
            .where(eq(planTratamiento.idPaciente, id_paciente))
            .orderBy(desc(planTratamiento.fechaInicio));

        if (!plans.length) return [];

        const ids = plans.map(p => p.idPlan);

        const procedimientosResult = await db.select({
            id_procedimiento: planTratamientoProcedimientos.idProcedimiento,
            id_plan: planTratamientoProcedimientos.idPlan,
            id_catalogo_procedimiento: planTratamientoProcedimientos.idCatalogoProcedimiento,
            nombre: catalogoProcedimientos.nombre,
            descripcion: catalogoProcedimientos.descripcion,
            status: planTratamientoProcedimientos.status,
            cantidad: planTratamientoProcedimientos.cantidad,
            precio_unitario: planTratamientoProcedimientos.precioUnitario,
            precio_base: preciosProcedimientos.precio
        })
            .from(planTratamientoProcedimientos)
            .innerJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, planTratamientoProcedimientos.idCatalogoProcedimiento))
            .leftJoin(preciosProcedimientos, eq(preciosProcedimientos.idCatalogoProcedimiento, catalogoProcedimientos.idCatalogoProcedimiento))
            .where(inArray(planTratamientoProcedimientos.idPlan, ids));

        const pagosResult = await db.select({
            id_plan: pagos.idPlan,
            total_pagado: sql`IFNULL(SUM(${pagos.monto}), 0)`.mapWith(Number)
        })
            .from(pagos)
            .where(inArray(pagos.idPlan, ids))
            .groupBy(pagos.idPlan);

        return plans.map(plan => ({
            ...plan,
            id_plan: plan.idPlan, // map camelcase to original property format
            procedimientos: procedimientosResult.filter(p => p.id_plan === plan.idPlan),
            total_pagado: pagosResult.find(p => p.id_plan === plan.idPlan)?.total_pagado || 0
        }));
    },

    async update(id_plan, data) {
        const [result] = await db.update(planTratamiento).set({
            nombrePlan: data.nombre_plan ?? null,
            fechaInicio: data.fecha_inicio ?? null,
            fechaFinEstimada: data.fecha_fin_estimada ?? null,
            costoTotalInicial: data.costo_total_inicial ?? 0,
            costoAjustado: data.costo_ajustado ?? 0,
            razonAjuste: data.razon_ajuste ?? null,
            planPago: data.plan_pago ?? 'Pago único',
            estado: data.estado ?? 'En Progreso'
        })
            .where(eq(planTratamiento.idPlan, id_plan));

        return result.affectedRows;
    },

    async delete(id_plan) {
        const [result] = await db.delete(planTratamiento)
            .where(eq(planTratamiento.idPlan, id_plan));

        return result.affectedRows;
    }

};

module.exports = Tratamiento;
