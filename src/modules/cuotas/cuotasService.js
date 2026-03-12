const CuotasModel = require('./cuotasModel');
const db = require('../../db/index');
const { planTratamiento, pacientes } = require('../../db/schema');
const { eq, and } = require('drizzle-orm');

const CuotasService = {

    getCuotas: async () => {
        return CuotasModel.getAll();
    },

    getCuotaById: async (id_cuota) => {
        const cuota = await CuotasModel.getById(id_cuota);
        if (!cuota) throw new Error('Cuota no encontrada');
        return cuota;
    },

    getCuotasByPlan: async (id_plan) => {
        return CuotasModel.getByPlanId(id_plan);
    },

    getCuotasByPaciente: async (id_paciente) => {
        return CuotasModel.getByPacienteId(id_paciente);
    },

    createCuota: async (data) => {
        if (!data.id_plan) throw new Error('El id_plan es obligatorio');
        if (!data.id_paciente) throw new Error('El id_paciente es obligatorio');
        if (!data.monto) throw new Error('El monto es obligatorio');
        if (!data.fecha_programada) throw new Error('La fecha_programada es obligatoria');

        await validarPlanYPaciente(data.id_plan, data.id_paciente);

        return CuotasModel.create(data);
    },

    createManyCuotas: async (cuotas, connection = db) => {
        if (!Array.isArray(cuotas) || !cuotas.length) {
            throw new Error('El arreglo de cuotas es inválido');
        }

        const { id_plan, id_paciente } = cuotas[0];
        await validarPlanYPaciente(id_plan, id_paciente);

        return CuotasModel.createMany(cuotas, connection);
    },

    updateCuota: async (id_cuota, data) => {
        const cuota = await CuotasModel.getById(id_cuota);
        if (!cuota) throw new Error('Cuota no encontrada');

        if (cuota.pagada) {
            throw new Error('No se puede modificar una cuota pagada');
        }

        if (data.id_plan || data.id_paciente) {
            await validarPlanYPaciente(
                data.id_plan || cuota.id_plan,
                data.id_paciente || cuota.id_paciente
            );
        }

        return CuotasModel.update(id_cuota, data);
    },


    deleteCuota: async (id_cuota) => {
        const cuota = await CuotasModel.getById(id_cuota);
        if (!cuota) throw new Error('Cuota no encontrada');

        if (cuota.pagada) {
            throw new Error('No se puede eliminar una cuota pagada');
        }

        await CuotasModel.delete(id_cuota);
        return true;
    }

};

async function validarPlanYPaciente(id_plan, id_paciente) {
    const [plan] = await db.select()
        .from(planTratamiento)
        .where(eq(planTratamiento.idPlan, id_plan))
        .limit(1);
    
    if (!plan) throw new Error('El plan de tratamiento no existe');

    const [paciente] = await db.select()
        .from(pacientes)
        .where(eq(pacientes.idPaciente, id_paciente))
        .limit(1);

    if (!paciente) throw new Error('El paciente no existe');
}

module.exports = CuotasService;
