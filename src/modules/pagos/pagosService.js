const db = require('../../db/index');
const PagosModel = require('./pagosModel');
const CuotasModel = require('../cuotas/cuotasModel');

const PagosService = {

    getPagos: async () => {
        return await PagosModel.getAll();
    },

    getPagoById: async (id) => {
        const pago = await PagosModel.getById(id);
        if (!pago) throw new Error('Pago no encontrado');
        return pago;
    },

    getPagosByPaciente: async (id_paciente) => {
        const pagos = await PagosModel.getByPacienteId(id_paciente);
        return pagos; // mejor NO lanzar error si está vacío
    },

    createPago: async (data) => {
        const {
            id_cuota,
            id_paciente,
            id_plan,
            id_clinica,
            monto,
            metodo_pago,
            fecha_pago,
            referencia,
            nota,
            tipo_pago = 'Tratamiento'
        } = data;

        // Validación base
        if (!id_paciente || !monto || !metodo_pago || !id_clinica) {
            throw new Error('Datos obligatorios incompletos (paciente, monto, método o clínica)');
        }

        // Si es tratamiento normal o uso de saldo, requiere plan
        if (tipo_pago !== 'Anticipo' && !id_plan) {
            throw new Error('Debe especificar un plan de tratamiento para este tipo de pago');
        }

        try {
            const PacienteModel = require('../pacientes/pacienteModel');

            return await db.transaction(async (tx) => {
                // 1. Obtener paciente para el saldo actual
                const pacienteActual = await PacienteModel.findById(id_paciente);
                if (!pacienteActual) throw new Error('Paciente no encontrado');

                const saldoActual = Number(pacienteActual.saldo_favor || 0);

                // 2. Gestionar el saldo según el tipo de pago
                if (tipo_pago === 'Anticipo') {
                    // SUMAR AL SALDO A FAVOR
                    const nuevoSaldo = saldoActual + Number(monto);
                    await PacienteModel.updateSaldoFavor(id_paciente, nuevoSaldo, tx);
                } else if (tipo_pago === 'Uso de Saldo') {
                    // RESTAR DEL SALDO A FAVOR
                    if (saldoActual < Number(monto)) {
                        throw new Error(`Saldo insuficiente. El paciente solo tiene ${saldoActual}`);
                    }
                    const nuevoSaldo = saldoActual - Number(monto);
                    await PacienteModel.updateSaldoFavor(id_paciente, nuevoSaldo, tx);
                }

                // 3. Crear el registro de pago
                const pagoId = await PagosModel.create({
                    id_cuota,
                    id_paciente,
                    id_plan,
                    id_clinica,
                    monto,
                    metodo_pago,
                    fecha_pago,
                    referencia,
                    nota,
                    tipo_pago // Pasamos el tipo
                }, tx);

                // 4. Marcar cuota si aplica
                if (id_cuota) {
                    await CuotasModel.marcarComoPagada(id_cuota, tx);
                }

                return {
                    id_pago: pagoId,
                    message: tipo_pago === 'Anticipo' ? 'Anticipo registrado y saldo actualizado' : 'Pago registrado correctamente'
                };
            });
        } catch (error) {
            console.error("Error en createPago transaction:", error);
            throw error;
        }
    },

    updatePago: async (id, data) => {
        const pago = await PagosModel.getById(id);
        if (!pago) throw new Error('Pago no encontrado');
        return await PagosModel.update(id, data);
    },

    deletePago: async (id) => {
        const affectedRows = await PagosModel.delete(id);
        if (!affectedRows) throw new Error('Pago no encontrado');
        return true;
    },
    getPagosPorPaciente: async (id_paciente) => {
        const pendientesCuotas = await PagosModel.getCuotasPendientes(id_paciente);
        const pendientesUnicos = await PagosModel.getPagosUnicosPendientes(id_paciente);
        const pagados = await PagosModel.getPagosRegistrados(id_paciente);

        return {
            pendientes: [...pendientesCuotas, ...pendientesUnicos],
            pagados
        };
    },
    getResumenPagosClinica: async (id_clinica) => {
        const pagados = await PagosModel.getPagosRegistradosPorClinica(id_clinica);
        const cuotasPendientes = await PagosModel.getCuotasPendientesPorClinica(id_clinica);
        const pagosUnicosPendientes = await PagosModel.getPagosUnicosPendientesPorClinica(id_clinica);

        return {
            pagados,
            pendientes: [
                ...cuotasPendientes,
                ...pagosUnicosPendientes
            ]
        };
    }
};

module.exports = PagosService;
