const db = require('../../db/index');
const { eq, and, desc, sql } = require('drizzle-orm');
const { consultas, dentistas } = require('../../db/schema');

const cCols = {
  id_consulta: consultas.idConsulta,
  id_clinica: consultas.idClinica,
  id_paciente: consultas.idPaciente,
  id_dentista: consultas.idDentista,
  motivo_consulta: consultas.motivoConsulta,
  examen_extraoral: consultas.examenExtraoral,
  examen_intraoral: consultas.examenIntraoral,
  fecha_consulta: consultas.fechaConsulta,
  proxima_cita: consultas.proximaCita,
  notas: consultas.notas,
  estado: consultas.estado
};

const Consulta = {
  async create(data) {
    const [result] = await db.insert(consultas).values({
      idClinica: data.id_clinica,
      idPaciente: data.id_paciente,
      idDentista: data.id_dentista,
      motivoConsulta: data.motivo_consulta ?? null,
      examenExtraoral: data.examen_extraoral ?? null,
      examenIntraoral: data.examen_intraoral ?? null,
      fechaConsulta: data.fecha_consulta ?? null,
      proximaCita: data.proxima_cita ?? null,
      notas: data.notas ?? null
    });
    return result.insertId;
  },

  async findById(id_consulta) {
    const result = await db.select(cCols).from(consultas).where(eq(consultas.idConsulta, id_consulta));
    return result[0];
  },

  async findByPaciente(id_paciente) {
    const result = await db.select({
      id_consulta: consultas.idConsulta,
      id_clinica: consultas.idClinica,
      id_paciente: consultas.idPaciente,
      id_dentista: consultas.idDentista,
      motivo_consulta: consultas.motivoConsulta,
      examen_extraoral: consultas.examenExtraoral,
      examen_intraoral: consultas.examenIntraoral,
      fecha_consulta: consultas.fechaConsulta,
      proxima_cita: consultas.proximaCita,
      notas: consultas.notas,
      dentista_nombre: sql`CONCAT(${dentistas.nombre}, ' ', IFNULL(${dentistas.apellidoPaterno}, ''), ' ', IFNULL(${dentistas.apellidoMaterno}, ''))`
    })
      .from(consultas)
      .innerJoin(dentistas, eq(dentistas.idDentista, consultas.idDentista))
      .where(
        and(
          eq(consultas.idPaciente, id_paciente),
          eq(dentistas.activo, 1)
        )
      )
      .orderBy(desc(consultas.fechaConsulta));

    return result;
  },

  async update(id_consulta, data) {
    const [result] = await db.update(consultas)
      .set({
        motivoConsulta: data.motivo_consulta ?? null,
        examenExtraoral: data.examen_extraoral ?? null,
        examenIntraoral: data.examen_intraoral ?? null,
        proximaCita: data.proxima_cita ?? null,
        notas: data.notas ?? null
      })
      .where(eq(consultas.idConsulta, id_consulta));
    return result.affectedRows;
  },

  async delete(id_consulta) {
    const [result] = await db.delete(consultas).where(eq(consultas.idConsulta, id_consulta));
    return result.affectedRows;
  },
};

module.exports = Consulta;
