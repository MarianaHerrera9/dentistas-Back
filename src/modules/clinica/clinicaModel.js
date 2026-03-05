const db = require('../../db/index');
const { eq } = require('drizzle-orm');
const { clinicas, configuracionClinica } = require('../../db/schema');
const defaultConfig = require('./configuracion_clinica/defaultConfiguracionClinica');

const Clinica = {
  async create(data) {
    return await db.transaction(async (tx) => {
      const [result] = await tx.insert(clinicas).values({
        nombre: data.nombre,
        subdominio: data.subdominio,
        direccion: data.direccion,
        telefono: data.telefono,
        correoContacto: data.correo_contacto,
        planSaas: data.plan_saas,
        limitePacientes: data.limite_pacientes,
        activo: 1
      });

      const idClinica = result.insertId;

      await tx.insert(configuracionClinica).values({
        idClinica,
        duracionBloque: defaultConfig.duracion_bloque,
        tiempoEntreCitas: defaultConfig.tiempo_entre_citas,
        tiempoAnticipacionCancelacion: defaultConfig.tiempo_anticipacion_cancelacion,
        maxCitasDia: defaultConfig.max_citas_dia,
        permiteAgendamientoOnline: defaultConfig.permite_agendamiento_online,
        toleranciaLlegadaMinutos: defaultConfig.tolerancia_llegada_minutos,
        permitirReservaSuperpuesta: defaultConfig.permitir_reserva_superpuesta,
        requiereAnticipo: defaultConfig.requiere_anticipo,
        zonaHoraria: defaultConfig.zona_horaria,
        diasLaborales: JSON.stringify(defaultConfig.dias_laborales),
        horaInicioClinica: defaultConfig.hora_inicio_clinica,
        horaFinClinica: defaultConfig.hora_fin_clinica
      });

      return idClinica;
    });
  },

  async update(idClinica, data) {
    await db.update(clinicas)
      .set({
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        correoContacto: data.correo_contacto,
        colorPrincipal: data.color_principal,
        colorSecundario: data.color_secundario,
        colorExtra: data.color_extra
      })
      .where(eq(clinicas.idClinica, idClinica));
  },
};
module.exports = Clinica;
