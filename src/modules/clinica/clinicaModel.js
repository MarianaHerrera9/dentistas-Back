const db = require('../../config/db');
const defaultConfig = require('./configuracion_clinica/defaultConfiguracionClinica');

const Clinica = {
  async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
    
      const [result] = await connection.execute(
        `INSERT INTO clinicas 
        (nombre, subdominio, direccion, telefono, correo_contacto, plan_saas, limite_pacientes, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, true)`,
        [
          data.nombre,
          data.subdominio,
          data.direccion,
          data.telefono,
          data.correo_contacto,
          data.plan_saas,
          data.limite_pacientes
        ]
      );

      const idClinica = result.insertId;

      await connection.execute(
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
          hora_fin_clinica
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idClinica,
          defaultConfig.duracion_bloque,
          defaultConfig.tiempo_entre_citas,
          defaultConfig.tiempo_anticipacion_cancelacion,
          defaultConfig.max_citas_dia,
          defaultConfig.permite_agendamiento_online,
          defaultConfig.tolerancia_llegada_minutos,
          defaultConfig.permitir_reserva_superpuesta,
          defaultConfig.requiere_anticipo,
          defaultConfig.zona_horaria,
          JSON.stringify(defaultConfig.dias_laborales),
          defaultConfig.hora_inicio_clinica,
          defaultConfig.hora_fin_clinica,
        ]
      );

      await connection.commit();
      return idClinica;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  async update(idClinica, data) {
    await db.execute(
      `
      UPDATE clinicas SET
        nombre = ?,
        direccion = ?,
        telefono = ?,
        correo_contacto = ?,
        color_principal = ?,
        color_secundario = ?,
        color_extra = ?
      WHERE id_clinica = ?
      `,
      [
        data.nombre,
        data.direccion,
        data.telefono,
        data.correo_contacto,
        data.color_principal,
        data.color_secundario,
        data.color_extra,
        idClinica
      ]
    );
  },
};
module.exports = Clinica;
