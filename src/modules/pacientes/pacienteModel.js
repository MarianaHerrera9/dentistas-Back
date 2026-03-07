const db = require('../../db/index');
const { eq, and, isNull, or, sql, not } = require('drizzle-orm');
const { pacientes } = require('../../db/schema');

const pCols = {
  id_paciente: pacientes.idPaciente,
  id_clinica: pacientes.idClinica,
  nombre: pacientes.nombre,
  apellido_paterno: pacientes.apellidoPaterno,
  apellido_materno: pacientes.apellidoMaterno,
  fecha_nacimiento: pacientes.fechaNacimiento,
  sexo: pacientes.sexo,
  telefono: pacientes.telefono,
  correo: pacientes.correo,
  direccion: pacientes.direccion,
  escolaridad: pacientes.escolaridad,
  ocupacion: pacientes.ocupacion,
  requiere_tutor: pacientes.requiereTutor,
  nombre_tutor: pacientes.nombreTutor,
  telefono_tutor: pacientes.telefonoTutor,
  activo: pacientes.activo,
  fecha_registro: pacientes.fechaRegistro,
  canal_adquisicion: pacientes.canalAdquisicion
};

const Paciente = {
  async create(data) {
    const [result] = await db.insert(pacientes).values({
      idClinica: data.id_clinica,
      nombre: data.nombre,
      apellidoPaterno: data.apellido_paterno,
      apellidoMaterno: data.apellido_materno ?? null,
      fechaNacimiento: data.fecha_nacimiento ?? null,
      sexo: data.sexo ?? null,
      telefono: data.telefono ?? null,
      correo: data.correo ?? null,
      direccion: data.direccion ?? null,
      escolaridad: data.escolaridad ?? null,
      ocupacion: data.ocupacion ?? null,
      requiereTutor: data.requiere_tutor ?? null,
      nombreTutor: data.nombre_tutor ?? null,
      telefonoTutor: data.telefono_tutor ?? null,
      canalAdquisicion: data.canal_adquisicion ?? null,
      activo: 1
    });
    return result.insertId;
  },

  async existsByNombre(id_clinica, nombre, apellido_paterno, apellido_materno) {
    const result = await db.select({ id_paciente: pacientes.idPaciente })
      .from(pacientes)
      .where(and(
        eq(pacientes.idClinica, id_clinica),
        eq(pacientes.nombre, nombre),
        eq(pacientes.apellidoPaterno, apellido_paterno),
        apellido_materno ? eq(pacientes.apellidoMaterno, apellido_materno) : isNull(pacientes.apellidoMaterno)
      ))
      .limit(1);

    return result[0];
  },

  async findById(id_paciente) {
    const result = await db.select(pCols).from(pacientes).where(eq(pacientes.idPaciente, id_paciente));
    return result[0];
  },

  async findByClinica(id_clinica) {
    const result = await db.select(pCols).from(pacientes).where(eq(pacientes.idClinica, id_clinica));
    return result;
  },

  async update(id_paciente, data) {
    const [result] = await db.update(pacientes)
      .set({
        nombre: data.nombre,
        apellidoPaterno: data.apellido_paterno,
        apellidoMaterno: data.apellido_materno,
        telefono: data.telefono,
        correo: data.correo,
        direccion: data.direccion,
        activo: data.activo,
        escolaridad: data.escolaridad,
        ocupacion: data.ocupacion
      })
      .where(eq(pacientes.idPaciente, id_paciente));

    return result.affectedRows;
  },

  async delete(id_paciente) {
    const [result] = await db.update(pacientes)
      .set({ activo: sql`NOT ${pacientes.activo}` })
      .where(eq(pacientes.idPaciente, id_paciente));

    return result.affectedRows;
  }
};

module.exports = Paciente;
