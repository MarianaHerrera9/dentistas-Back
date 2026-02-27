const db = require('../../config/db');

const Paciente = {
    async create(data) {
        const [result] = await db.execute(
          `INSERT INTO pacientes (
            id_clinica,
            nombre,
            apellido_paterno,
            apellido_materno,
            fecha_nacimiento,
            sexo,
            telefono,
            correo,
            direccion,
            escolaridad,
            ocupacion,
            requiere_tutor,
            nombre_tutor,
            telefono_tutor,
            activo
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?, true)`,
          [
            data.id_clinica,
            data.nombre,
            data.apellido_paterno,
            data.apellido_materno ?? null,
            data.fecha_nacimiento ?? null,
            data.sexo ?? null,
            data.telefono ?? null,
            data.correo ?? null,
            data.direccion ?? null,
            data.escolaridad ?? null,
            data.ocupacion ?? null,
            data.requiere_tutor ?? null,
            data.nombre_tutor ?? null,
            data.telefono_tutor ?? null
          ]
        );
        return result.insertId;
      },

    async existsByNombre(id_clinica, nombre, apellido_paterno, apellido_materno) {
        const [rows] = await db.execute(
            `SELECT id_paciente 
     FROM pacientes 
     WHERE id_clinica = ? 
     AND nombre = ? 
     AND apellido_paterno = ? 
     AND (apellido_materno = ? OR apellido_materno IS NULL)
     LIMIT 1`,
            [id_clinica, nombre, apellido_paterno, apellido_materno ?? null]
        );

        return rows[0];
    },

  async findById(id_paciente) {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE id_paciente = ?', [id_paciente]);
    return rows[0];
  },
  async findByClinica(id_clinica) {
    const [rows] = await db.execute('SELECT * FROM pacientes WHERE id_clinica = ?', [id_clinica]);
    return rows;
  },
  async update(id_paciente, data) {

    const [result] = await db.execute(
        `UPDATE pacientes SET nombre=?, apellido_paterno=?, apellido_materno=?, telefono=?, correo=?, direccion=?, activo=?, escolaridad=?, ocupacion=? WHERE id_paciente=?`,
        [data.nombre, data.apellido_paterno, data.apellido_materno, data.telefono, data.correo, data.direccion, data.activo, data.escolaridad, data.ocupacion, id_paciente]);
    return result.affectedRows;
  },
  async delete(id_paciente) {
    const [result] = await db.execute(
      `UPDATE pacientes 
     SET activo = NOT activo 
     WHERE id_paciente = ?`,
      [id_paciente]
    );

    return result.affectedRows;
  },    
  async findByClinica(id_clinica) {
    const [rows] = await db.execute(
      'SELECT * FROM pacientes WHERE id_clinica = ?',
      [id_clinica]
    );
    return rows;
  }
  
};
module.exports = Paciente;
