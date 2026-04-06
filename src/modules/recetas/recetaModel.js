const db = require('../../db/index');
const { eq, and, inArray } = require('drizzle-orm');
const { recetas, recetaMedicamentos } = require('../../db/schema');

const Receta = {
  async create(data) {
    const folioAuto = data.folio || `REC-${Math.floor(Date.now() / 1000).toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const [result] = await db.insert(recetas).values({
      idClinica: data.id_clinica,
      idPaciente: data.id_paciente,
      idDentista: data.id_dentista,
      folio: folioAuto,
      peso: data.peso === '' ? null : data.peso,
      talla: data.talla === '' ? null : data.talla,
      imc: data.imc === '' ? null : data.imc,
      temperatura: data.temperatura === '' ? null : data.temperatura,
      presionArterial: data.presion_arterial || null,
      alergias: data.alergias || null,
      diagnostico: data.diagnostico || null,
      edadPaciente: data.edad_paciente === '' ? null : data.edad_paciente,
      generoPaciente: data.genero_paciente || null,
    });
    
    const insertId = result.insertId;

    if (data.medicamentos && data.medicamentos.length > 0) {
      const medsToInsert = data.medicamentos.map(med => ({
        idReceta: insertId,
        nombreGenerico: med.nombre_generico,
        formaFarmaceutica: med.forma_farmaceutica,
        dosis: med.dosis,
        presentacion: med.presentacion,
        frecuencia: med.frecuencia,
        viaAdministracion: med.via_administracion,
        duracionTratamiento: med.duracion_tratamiento,
        indicaciones: med.indicaciones,
      }));
      await db.insert(recetaMedicamentos).values(medsToInsert);
    }

    return insertId;
  },

  async getAllByPaciente(id_paciente) {
    const recetasList = await db.select()
      .from(recetas)
      .where(eq(recetas.idPaciente, id_paciente))
      .orderBy(recetas.fechaEmision);
      
    if (recetasList.length === 0) return [];
    
    const recetasIds = recetasList.map(r => r.idReceta);
    const medsList = await db.select().from(recetaMedicamentos).where(inArray(recetaMedicamentos.idReceta, recetasIds));
    
    return recetasList.map(r => ({
      ...r,
      medicamentos: medsList.filter(m => m.idReceta === r.idReceta)
    }));
  },

  async getById(id_receta) {
    const result = await db.select()
      .from(recetas)
      .where(eq(recetas.idReceta, id_receta));
      
    if (result.length === 0) return null;
    
    const receta = result[0];
    const medicamentos = await db.select()
      .from(recetaMedicamentos)
      .where(eq(recetaMedicamentos.idReceta, id_receta));
      
    receta.medicamentos = medicamentos;
    return receta;
  },

  async delete(id_receta) {
    const [result] = await db.delete(recetas)
      .where(eq(recetas.idReceta, id_receta));
    return result.affectedRows > 0;
  }
};

module.exports = Receta;
