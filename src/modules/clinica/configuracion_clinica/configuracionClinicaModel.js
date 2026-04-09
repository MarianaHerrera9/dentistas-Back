const db = require('../../../config/db');

const parseDiasLaborales = (raw) => {
  if (!raw) return [];

  if (Array.isArray(raw)) return raw;

  if (typeof raw === 'string') {
    const trimmed = raw.trim();

    if (trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return [];
      }
    }

    return trimmed
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);
  }

  return [];
};

const ConfiguracionClinica = {
  async getByClinica(idClinica) {
    const [rows] = await db.execute(
      `SELECT 
        duracion_bloque,
        tiempo_entre_citas,
        tiempo_anticipacion_cancelacion,
        max_citas_dia,
        permite_agendamiento_online,
        tolerancia_llegada_minutos,
        permitir_reserva_superpuesta,
        requiere_anticipo,
        zona_horaria,
        dias_laborales,
        hora_inicio_clinica,
        hora_fin_clinica,
        modo_color_agenda,
        max_citas_simultaneas
      FROM configuracion_clinica
      WHERE id_clinica = ?`,
      [idClinica]
    );

    if (!rows[0]) return null;

    return {
      ...rows[0],
      dias_laborales: parseDiasLaborales(rows[0].dias_laborales),
    };
  },

  async updateByClinica(idClinica, data) {
    const diasLaborales = JSON.stringify(data.dias_laborales || []);

    const [existing] = await db.execute(
      `SELECT id_config 
       FROM configuracion_clinica 
       WHERE id_clinica = ?`,
      [idClinica]
    );

    if (existing.length > 0) {
      await db.execute(
        `UPDATE configuracion_clinica
         SET duracion_bloque = ?,
             tiempo_entre_citas = ?,
             tiempo_anticipacion_cancelacion = ?,
             max_citas_dia = ?,
             permite_agendamiento_online = ?,
             tolerancia_llegada_minutos = ?,
             permitir_reserva_superpuesta = ?,
             requiere_anticipo = ?,
             zona_horaria = ?,
             dias_laborales = ?,
             hora_inicio_clinica = ?,
             hora_fin_clinica = ?,
             modo_color_agenda = ?,
             max_citas_simultaneas = ?
         WHERE id_clinica = ?`,
        [
          data.duracion_bloque,
          data.tiempo_entre_citas,
          data.tiempo_anticipacion_cancelacion,
          data.max_citas_dia,
          data.permite_agendamiento_online,
          data.tolerancia_llegada_minutos,
          data.permitir_reserva_superpuesta,
          data.requiere_anticipo,
          data.zona_horaria,
          diasLaborales,
          data.hora_inicio_clinica,
          data.hora_fin_clinica,
          data.modo_color_agenda || 'dentista',
          data.max_citas_simultaneas || 1,
          idClinica,
        ]
      );
    } else {
      await db.execute(
        `INSERT INTO configuracion_clinica (
          id_clinica,
          duracion_bloque,
          tiempo_entre_citas,
          tiempo_anticipacion_cancelacion,
          max_citas_dia,
          permite_agendamiento_online,
          tolerancia_llegada_minutos,
          permitir_reserva_superpuesta,
          requiere_anticipo,
          zona_horaria,
          dias_laborales,
          hora_inicio_clinica,
          hora_fin_clinica,
          modo_color_agenda,
          max_citas_simultaneas
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idClinica,
          data.duracion_bloque,
          data.tiempo_entre_citas,
          data.tiempo_anticipacion_cancelacion,
          data.max_citas_dia,
          data.permite_agendamiento_online,
          data.tolerancia_llegada_minutos,
          data.permitir_reserva_superpuesta,
          data.requiere_anticipo,
          data.zona_horaria,
          diasLaborales,
          data.hora_inicio_clinica,
          data.hora_fin_clinica,
          data.modo_color_agenda || 'dentista',
          data.max_citas_simultaneas || 1,
        ]
      );
    }
  },
};

module.exports = ConfiguracionClinica;
