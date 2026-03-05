const db = require('../../db/index');
const { eq } = require('drizzle-orm');
const { dentistas } = require('../../db/schema');

const Dentista = {
  async create(data) {
    const [result] = await db.insert(dentistas).values({
      idClinica: data.id_clinica,
      nombre: data.nombre,
      apellidoPaterno: data.apellido_paterno,
      apellidoMaterno: data.apellido_materno,
      telefono: data.telefono,
      correo: data.correo,
      especialidad: data.especialidad,
      activo: 1
    });
    return result.insertId;
  },
  async findById(id_dentista) {
    const result = await db.select({
      id_dentista: dentistas.idDentista,
      id_clinica: dentistas.idClinica,
      nombre: dentistas.nombre,
      apellido_paterno: dentistas.apellidoPaterno,
      apellido_materno: dentistas.apellidoMaterno,
      especialidad: dentistas.especialidad,
      telefono: dentistas.telefono,
      correo: dentistas.correo,
      activo: dentistas.activo
    }).from(dentistas).where(eq(dentistas.idDentista, id_dentista));
    return result[0];
  },
  async update(id, data) {
    const [result] = await db.update(dentistas)
      .set({
        nombre: data.nombre,
        apellidoPaterno: data.apellido_paterno,
        apellidoMaterno: data.apellido_materno,
        telefono: data.telefono,
        correo: data.correo,
        especialidad: data.especialidad
      })
      .where(eq(dentistas.idDentista, id));
    return result.affectedRows > 0;
  },
  async inactivarDentista(id, status) {
    const nuevoEstado = status ? 1 : 0;
    const [result] = await db.update(dentistas)
      .set({ activo: nuevoEstado })
      .where(eq(dentistas.idDentista, id));
    return result.affectedRows > 0;
  },
};
module.exports = Dentista;
