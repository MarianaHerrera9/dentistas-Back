const db = require('../../config/db');
const CitasModel = require('./citasModel');

const CitasService = {
    async createCita(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Verificar solapamiento con otras citas activas DEL MISMO DENTISTA
            const [dentistOverlap] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM citas
                 WHERE id_dentista = ?
                   AND fecha_cita = ?
                   AND estado IN ('Pendiente','Confirmada')
                   AND (hora_inicio < ? AND hora_fin > ?) FOR UPDATE`,
                [data.id_dentista, data.fecha_cita, data.hora_fin, data.hora_inicio]
            );

            if (dentistOverlap[0].total > 0) throw new Error('El dentista ya tiene una cita en este horario');

            // 2. Verificar CAPACIDAD GLOBAL de la clínica (Sillones)
            const [config] = await conn.execute(
                `SELECT permitir_reserva_superpuesta, max_citas_simultaneas 
                 FROM configuracion_clinica 
                 WHERE id_clinica = ?`,
                [data.id_clinica]
            );

            const { permitir_reserva_superpuesta, max_citas_simultaneas } = config[0] || { permitir_reserva_superpuesta: 0, max_citas_simultaneas: 1 };

            // Si no permiten superposición, el límite es 1. Si permiten, es max_citas_simultaneas.
            const limiteGlobal = permitir_reserva_superpuesta === 1 ? (max_citas_simultaneas || 1) : 1;

            const [globalOverlap] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM citas
                 WHERE id_clinica = ?
                   AND fecha_cita = ?
                   AND estado IN ('Pendiente','Confirmada')
                   AND (hora_inicio < ? AND hora_fin > ?)`,
                [data.id_clinica, data.fecha_cita, data.hora_fin, data.hora_inicio]
            );

            if (globalOverlap[0].total >= limiteGlobal) {
                throw new Error(`Capacidad máxima de la clínica alcanzada (${limiteGlobal} sillón/es ocupado/s)`);
            }

            // 2. Verificar vacaciones del doctor en esa fecha (bloqueo día completo)
            const [vacaciones] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM ausencias_dentistas
                 WHERE id_dentista = ?
                   AND tipo = 'vacaciones'
                   AND fecha_inicio <= ?
                   AND fecha_fin >= ?`,
                [data.id_dentista, data.fecha_cita, data.fecha_cita]
            );

            if (vacaciones[0].total > 0) {
                throw new Error('El doctor tiene vacaciones ese día y no puede recibir citas');
            }

            // 3. Verificar no_disponibilidades que solapen el horario
            const [noDisponible] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM ausencias_dentistas
                 WHERE id_dentista = ?
                   AND tipo = 'no_disponibilidad'
                   AND fecha_inicio = ?
                   AND hora_inicio < ?
                   AND hora_fin > ?`,
                [data.id_dentista, data.fecha_cita, data.hora_fin, data.hora_inicio]
            );

            if (noDisponible[0].total > 0) {
                throw new Error('El doctor no está disponible en ese horario');
            }

            await conn.execute(
                `INSERT INTO citas (
                    id_clinica,
                    id_paciente,
                    id_dentista,
                    fecha_cita,
                    hora_inicio,
                    hora_fin,
                    id_procedimiento,
                    notas,
                    estado,
                    creado_por
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pendiente', ?)`,
                [
                    data.id_clinica,
                    data.id_paciente,
                    data.id_dentista,
                    data.fecha_cita,
                    data.hora_inicio,
                    data.hora_fin,
                    data.id_procedimiento,
                    data.notas,
                    data.creado_por,
                ]
            );

            await conn.commit();
            return { success: true };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },


    getAgendaByDate(id_clinica, fecha) {
        return CitasModel.getByDate(id_clinica, fecha);
    },

    getAgendaByWeek(id_clinica, start_date, end_date) {
        return CitasModel.getByWeek(id_clinica, start_date, end_date);
    },

    getAgendaByMonth(id_clinica, year, month) {
        return CitasModel.getByMonth(id_clinica, year, month);
    },

    cancelar(id_cita) {
        return CitasModel.updateStatus(id_cita, 'Cancelada');
    },

    confirmar(id_cita) {
        return CitasModel.updateStatus(id_cita, 'Confirmada');
    },

    completar(id_cita) {
        return CitasModel.updateStatus(id_cita, 'Completada');
    },

    asistio(id_cita) {
        return CitasModel.updateStatus(id_cita, 'Asistió');
    },

    noAsistio(id_cita) {
        return CitasModel.updateStatus(id_cita, 'No asistió');
    },

    async reagendar(id_cita, data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Verificar solapamiento para el dentista (excluyendo la cita actual)
            const [dentistOverlap] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM citas
                 WHERE id_dentista = ?
                   AND fecha_cita = ?
                   AND id_cita != ?
                   AND estado IN ('Pendiente','Confirmada')
                   AND (hora_inicio < ? AND hora_fin > ?)`,
                [data.id_dentista, data.fecha_cita, id_cita, data.hora_fin, data.hora_inicio]
            );

            if (dentistOverlap[0].total > 0) throw new Error('El dentista ya tiene una cita en este horario');

            // 2. Verificar CAPACIDAD GLOBAL (excluyendo la cita actual)
            const [config] = await conn.execute(
                `SELECT permitir_reserva_superpuesta, max_citas_simultaneas 
                 FROM configuracion_clinica 
                 WHERE id_clinica = (SELECT id_clinica FROM citas WHERE id_cita = ?)`,
                [id_cita]
            );

            const { permitir_reserva_superpuesta, max_citas_simultaneas } = config[0] || { permitir_reserva_superpuesta: 0, max_citas_simultaneas: 1 };
            const limiteGlobal = permitir_reserva_superpuesta === 1 ? (max_citas_simultaneas || 1) : 1;

            const [globalOverlap] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM citas
                 WHERE id_clinica = (SELECT id_clinica FROM citas WHERE id_cita = ?)
                   AND fecha_cita = ?
                   AND id_cita != ?
                   AND estado IN ('Pendiente','Confirmada')
                   AND (hora_inicio < ? AND hora_fin > ?)`,
                [id_cita, data.fecha_cita, id_cita, data.hora_fin, data.hora_inicio]
            );

            if (globalOverlap[0].total >= limiteGlobal) {
                throw new Error(`Capacidad máxima de la clínica alcanzada (${limiteGlobal} sillón/es ocupado/s)`);
            }

            // 3. Actualizar cita
            await conn.execute(
                `UPDATE citas 
                 SET id_dentista = ?, fecha_cita = ?, hora_inicio = ?, hora_fin = ?, id_procedimiento = ?, notas = ?
                 WHERE id_cita = ?`,
                [data.id_dentista, data.fecha_cita, data.hora_inicio, data.hora_fin, data.id_procedimiento, data.notas, id_cita]
            );

            await conn.commit();
            return { success: true };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    update(id_cita, data) {
        return CitasModel.update(id_cita, data);
    },


    getCitasByPaciente(id_paciente) {
        return CitasModel.getByPaciente(id_paciente);
    },

};

module.exports = CitasService;
