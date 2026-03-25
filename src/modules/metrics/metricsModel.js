const db = require('../../db/index');
const { eq, and, gte, lte, sql, count, countDistinct, sum } = require('drizzle-orm');
const {
    citas,
    consultas,
    pagos,
    movimientosInventario,
    productos,
    pacientes,
} = require('../../db/schema');

const MetricsModel = {

    /**
     * Número de pacientes únicos atendidos en el período.
     * Se basa en citas con estado "Completada" dentro del rango.
     */
    getPacientesAtendidos: async (id_clinica, fecha_inicio, fecha_fin) => {
        const result = await db
            .select({ total: countDistinct(citas.idPaciente) })
            .from(citas)
            .where(
                and(
                    eq(citas.idClinica, id_clinica),
                    eq(citas.estado, 'Completada'),
                    gte(citas.fechaCita, fecha_inicio),
                    lte(citas.fechaCita, fecha_fin)
                )
            );
        return Number(result[0]?.total ?? 0);
    },

    /**
     * Total de consultas registradas (completadas) en el período.
     * Puede ser mayor que pacientes atendidos (mismo paciente, varias consultas).
     */
    getConsultasRealizadas: async (id_clinica, fecha_inicio, fecha_fin) => {
        const result = await db
            .select({ total: count(consultas.idConsulta) })
            .from(consultas)
            .where(
                and(
                    eq(consultas.idClinica, id_clinica),
                    gte(sql`DATE(${consultas.fechaConsulta})`, fecha_inicio),
                    lte(sql`DATE(${consultas.fechaConsulta})`, fecha_fin)
                )
            );
        return Number(result[0]?.total ?? 0);
    },

    /**
     * Suma total de pagos registrados en el período (ingresos).
     */
    getIngresos: async (id_clinica, fecha_inicio, fecha_fin) => {
        const result = await db
            .select({ total: sum(pagos.monto) })
            .from(pagos)
            .where(
                and(
                    eq(pagos.idClinica, id_clinica),
                    gte(sql`DATE(${pagos.fechaPago})`, fecha_inicio),
                    lte(sql`DATE(${pagos.fechaPago})`, fecha_fin)
                )
            );
        return Number(result[0]?.total ?? 0);
    },

    /**
     * Egresos: suma de (cantidad * costoUnitario) de movimientos de inventario tipo "Entrada" (compras)
     * + suma de costos de salidasDinero
     * + suma de costos de Trabajos de Laboratorio Terminados
     */
    getEgresos: async (id_clinica, fecha_inicio, fecha_fin) => {
        // 1. Gastos de Inventario
        const invResult = await db
            .select({
                total: sum(
                    sql`${movimientosInventario.cantidad} * ${productos.costoUnitario}`
                ),
            })
            .from(movimientosInventario)
            .innerJoin(
                productos,
                eq(movimientosInventario.idProducto, productos.idProducto)
            )
            .where(
                and(
                    eq(movimientosInventario.idClinica, id_clinica),
                    eq(movimientosInventario.tipo, 'Entrada'),
                    gte(sql`DATE(${movimientosInventario.fechaMovimiento})`, fecha_inicio),
                    lte(sql`DATE(${movimientosInventario.fechaMovimiento})`, fecha_fin)
                )
            );
        const invTotal = Number(invResult[0]?.total ?? 0);

        // 2. Gastos de Laboratorio (Terminados)
        const { trabajosLaboratorio } = require('../laboratorio/labSchema');
        const labResult = await db
            .select({
                total: sum(trabajosLaboratorio.cost)
            })
            .from(trabajosLaboratorio)
            .where(
                and(
                    eq(trabajosLaboratorio.clinicId, id_clinica),
                    eq(trabajosLaboratorio.status, 'Terminado_Entregado'),
                    gte(sql`DATE(${trabajosLaboratorio.updatedAt})`, fecha_inicio),
                    lte(sql`DATE(${trabajosLaboratorio.updatedAt})`, fecha_fin)
                )
            );
        const labTotal = Number(labResult[0]?.total ?? 0);

        return invTotal + labTotal;
    },

    /**
     * Canal de adquisición: distribución de cómo los pacientes NUEVOS del período
     * conocieron la clínica (campo canal_adquisicion de la tabla pacientes).
     * Retorna array con { canal, cantidad }.
     */
    getCanalAdquisicion: async (id_clinica, fecha_inicio, fecha_fin) => {
        const result = await db
            .select({
                canal: sql`COALESCE(${pacientes.canalAdquisicion}, 'Sin especificar')`,
                cantidad: count(pacientes.idPaciente),
            })
            .from(pacientes)
            .where(
                and(
                    eq(pacientes.idClinica, id_clinica),
                    gte(sql`DATE(${pacientes.fechaRegistro})`, fecha_inicio),
                    lte(sql`DATE(${pacientes.fechaRegistro})`, fecha_fin)
                )
            )
            .groupBy(pacientes.canalAdquisicion);

        return result.map((row) => ({
            canal: row.canal,
            cantidad: Number(row.cantidad),
        }));
    },
};

module.exports = MetricsModel;
