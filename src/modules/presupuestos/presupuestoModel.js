const db = require('../../db/index');
const { eq, desc, inArray } = require('drizzle-orm');
const {
    presupuestos,
    presupuestoDetalles,
    catalogoProcedimientos,
    planTratamiento,
    planTratamientoProcedimientos
} = require('../../db/schema');

const Presupuesto = {

    async create(data) {
        return await db.transaction(async (tx) => {
            const [result] = await tx.insert(presupuestos).values({
                idClinica: data.id_clinica,
                idPaciente: data.id_paciente,
                idDentista: data.id_dentista,
                nombre: data.nombre ?? 'Nuevo Presupuesto',
                estado: data.estado ?? 'Borrador',
                descuentoPorcentaje: data.descuento_porcentaje ?? 0,
                descuentoMonto: data.descuento_monto ?? 0,
                subtotal: data.subtotal ?? 0,
                total: data.total ?? 0,
                notas: data.notas ?? null,
                fechaExpiracion: data.fecha_expiracion ?? null
            });

            const id_presupuesto = result.insertId;

            if (data.detalles && data.detalles.length > 0) {
                const detallesInsert = data.detalles.map(d => ({
                    idPresupuesto: id_presupuesto,
                    idCatalogoProcedimiento: d.id_catalogo_procedimiento,
                    numeroDiente: d.numero_diente ?? null,
                    cantidad: d.cantidad ?? 1,
                    precioUnitario: d.precio_unitario ?? 0,
                    descuentoPorcentaje: d.descuento_porcentaje ?? 0,
                    descuentoMonto: d.descuento_monto ?? 0,
                    subtotal: d.subtotal ?? 0
                }));

                await tx.insert(presupuestoDetalles).values(detallesInsert);
            }

            return id_presupuesto;
        });
    },

    async findById(id_presupuesto) {
        const presRows = await db.select()
            .from(presupuestos)
            .where(eq(presupuestos.idPresupuesto, id_presupuesto));

        if (!presRows.length) return null;

        const presupuesto = presRows[0];

        // Fetch detalles
        const detRows = await db.select({
            id_detalle_presupuesto: presupuestoDetalles.idDetallePresupuesto,
            id_catalogo_procedimiento: presupuestoDetalles.idCatalogoProcedimiento,
            numero_diente: presupuestoDetalles.numeroDiente,
            cantidad: presupuestoDetalles.cantidad,
            precio_unitario: presupuestoDetalles.precioUnitario,
            descuento_porcentaje: presupuestoDetalles.descuentoPorcentaje,
            descuento_monto: presupuestoDetalles.descuentoMonto,
            subtotal: presupuestoDetalles.subtotal,
            nombre_procedimiento: catalogoProcedimientos.nombre,
            color_procedimiento: catalogoProcedimientos.color,
        })
            .from(presupuestoDetalles)
            .innerJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, presupuestoDetalles.idCatalogoProcedimiento))
            .where(eq(presupuestoDetalles.idPresupuesto, id_presupuesto));

        presupuesto.detalles = detRows;
        return presupuesto;
    },

    async findByPaciente(id_paciente) {
        const rows = await db.select()
            .from(presupuestos)
            .where(eq(presupuestos.idPaciente, id_paciente))
            .orderBy(desc(presupuestos.fechaCreacion));

        if (!rows.length) return [];

        const ids = rows.map(p => p.idPresupuesto);

        const detRows = await db.select({
            id_presupuesto: presupuestoDetalles.idPresupuesto,
            id_detalle_presupuesto: presupuestoDetalles.idDetallePresupuesto,
            id_catalogo_procedimiento: presupuestoDetalles.idCatalogoProcedimiento,
            numero_diente: presupuestoDetalles.numeroDiente,
            cantidad: presupuestoDetalles.cantidad,
            precio_unitario: presupuestoDetalles.precioUnitario,
            descuento_porcentaje: presupuestoDetalles.descuentoPorcentaje,
            descuento_monto: presupuestoDetalles.descuentoMonto,
            subtotal: presupuestoDetalles.subtotal,
            nombre_procedimiento: catalogoProcedimientos.nombre
        })
            .from(presupuestoDetalles)
            .innerJoin(catalogoProcedimientos, eq(catalogoProcedimientos.idCatalogoProcedimiento, presupuestoDetalles.idCatalogoProcedimiento))
            .where(inArray(presupuestoDetalles.idPresupuesto, ids));

        return rows.map(pres => ({
            ...pres,
            detalles: detRows.filter(d => Number(d.id_presupuesto) === Number(pres.idPresupuesto))
        }));
    },

    async update(id_presupuesto, data) {
        return await db.transaction(async (tx) => {
            const updateData = {};
            if (data.nombre !== undefined) updateData.nombre = data.nombre;
            if (data.estado !== undefined) updateData.estado = data.estado;
            if (data.descuento_porcentaje !== undefined) updateData.descuentoPorcentaje = data.descuento_porcentaje;
            if (data.descuento_monto !== undefined) updateData.descuentoMonto = data.descuento_monto;
            if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
            if (data.total !== undefined) updateData.total = data.total;
            if (data.notas !== undefined) updateData.notas = data.notas;
            if (data.fecha_expiracion !== undefined) updateData.fechaExpiracion = data.fecha_expiracion;

            if (Object.keys(updateData).length > 0) {
                await tx.update(presupuestos).set(updateData).where(eq(presupuestos.idPresupuesto, id_presupuesto));
            }

            // Sync detalles
            if (data.detalles) {
                await tx.delete(presupuestoDetalles).where(eq(presupuestoDetalles.idPresupuesto, id_presupuesto));
                if (data.detalles.length > 0) {
                    const detallesInsert = data.detalles.map(d => ({
                        idPresupuesto: id_presupuesto,
                        idCatalogoProcedimiento: d.id_catalogo_procedimiento,
                        numeroDiente: d.numero_diente ?? null,
                        cantidad: d.cantidad ?? 1,
                        precioUnitario: d.precio_unitario ?? 0,
                        descuentoPorcentaje: d.descuento_porcentaje ?? 0,
                        descuentoMonto: d.descuento_monto ?? 0,
                        subtotal: d.subtotal ?? 0
                    }));
                    await tx.insert(presupuestoDetalles).values(detallesInsert);
                }
            }

            return true;
        });
    },

    async updateStatus(id_presupuesto, estado) {
        const [result] = await db.update(presupuestos)
            .set({ estado })
            .where(eq(presupuestos.idPresupuesto, id_presupuesto));
        return result.affectedRows;
    },

    async accept(id_presupuesto) {
        return await db.transaction(async (tx) => {
            // Obtener el presupuesto y detalles
            const presRows = await tx.select().from(presupuestos).where(eq(presupuestos.idPresupuesto, id_presupuesto));
            if (!presRows.length) throw new Error('Presupuesto no encontrado');
            const presupuesto = presRows[0];
            
            if (presupuesto.estado === 'Aceptado') {
                throw new Error('El presupuesto ya fue aceptado previamente');
            }

            const detRows = await tx.select().from(presupuestoDetalles).where(eq(presupuestoDetalles.idPresupuesto, id_presupuesto));

            // Crear el Plan de Tratamiento
            const [planResult] = await tx.insert(planTratamiento).values({
                idClinica: presupuesto.idClinica,
                idPaciente: presupuesto.idPaciente,
                idDentista: presupuesto.idDentista,
                nombrePlan: presupuesto.nombre ?? 'Plan desde Presupuesto',
                fechaInicio: new Date().toISOString().split('T')[0],
                fechaFinEstimada: null,
                costoTotalInicial: presupuesto.total,
                costoAjustado: presupuesto.total,
                razonAjuste: 'Aceptado por presupuesto ID ' + id_presupuesto,
                planPago: 'Pago unico', // Por defecto, hasta que registren pagos
                estado: 'En Progreso'
            });

            const id_plan = planResult.insertId;

            // Mapear e insertar detalles como procedimientos del plan
            if (detRows.length > 0) {
                const procedimientosInsert = detRows.map(d => ({
                    idPlan: id_plan,
                    idClinica: presupuesto.idClinica,
                    idPaciente: presupuesto.idPaciente,
                    idCatalogoProcedimiento: d.idCatalogoProcedimiento,
                    status: 'Pendiente',
                    cantidad: d.cantidad,
                    precioUnitario: d.subtotal // o (d.subtotal / d.cantidad) si queremos unitario limpio
                }));
                await tx.insert(planTratamientoProcedimientos).values(procedimientosInsert);
            }

            // Cambiar estado del presupuesto
            await tx.update(presupuestos)
                .set({ estado: 'Aceptado' })
                .where(eq(presupuestos.idPresupuesto, id_presupuesto));
            
            return { id_plan, id_presupuesto };
        });
    },

    async delete(id_presupuesto) {
        const [result] = await db.delete(presupuestos).where(eq(presupuestos.idPresupuesto, id_presupuesto));
        return result.affectedRows;
    }
};

module.exports = Presupuesto;
