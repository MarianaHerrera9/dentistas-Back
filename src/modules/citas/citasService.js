const db = require('../../config/db');
const CitasModel = require('./citasModel');

const CitasService = {
    async createCita(data) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            // 1. Verificar solapamiento con otras citas activas
            const [rows] = await conn.execute(
                `SELECT COUNT(*) total
                 FROM citas
                 WHERE id_dentista = ?
                   AND fecha_cita = ?
                   AND estado IN ('Pendiente','Confirmada')
                   AND (hora_inicio < ? AND hora_fin > ?) FOR UPDATE`,
                [data.id_dentista, data.fecha_cita, data.hora_fin, data.hora_inicio]
            );

            if (rows[0].total > 0) throw new Error('Horario no disponible');

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
        const [rows] = await CitasModel.hasOverlap(data);
        if (rows[0].total > 0) throw new Error('Horario no disponible');
        return CitasModel.update(id_cita, data);
    },

    update(id_cita, data) {
        return CitasModel.update(id_cita, data);
    },


    getCitasByPaciente(id_paciente) {
        return CitasModel.getByPaciente(id_paciente);
    },

};

module.exports = CitasService;
