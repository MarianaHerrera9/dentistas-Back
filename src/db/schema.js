var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var schema_exports = {};
__export(schema_exports, {
  adminsSaas: () => adminsSaas,
  antecedentes: () => antecedentes,
  archivosClinicas: () => archivosClinicas,
  auditoria: () => auditoria,
  ausenciasDentistas: () => ausenciasDentistas,
  bloquesDisponibilidad: () => bloquesDisponibilidad,
  catalogoDiagnosticos: () => catalogoDiagnosticos,
  catalogoProcedimientos: () => catalogoProcedimientos,
  citas: () => citas,
  clinicas: () => clinicas,
  configuracionClinica: () => configuracionClinica,
  consultas: () => consultas,
  cuotasTratamiento: () => cuotasTratamiento,
  datosFacturacion: () => datosFacturacion,
  dentistas: () => dentistas,
  examenClinicoInicialExtraoral: () => examenClinicoInicialExtraoral,
  examenClinicoInicialIntraoral: () => examenClinicoInicialIntraoral,
  lotesProductos: () => lotesProductos,
  materialesUsados: () => materialesUsados,
  movimientosInventario: () => movimientosInventario,
  odontogramaDiagnosticos: () => odontogramaDiagnosticos,
  odontogramaProcedimientos: () => odontogramaProcedimientos,
  odontogramaVersiones: () => odontogramaVersiones,
  odontogramas: () => odontogramas,
  pacienteAtributosExtra: () => pacienteAtributosExtra,
  pacientes: () => pacientes,
  pacientesLogin: () => pacientesLogin,
  pagos: () => pagos,
  periodontogramaDetalles: () => periodontogramaDetalles,
  periodontogramas: () => periodontogramas,
  permisos: () => permisos,
  planTratamiento: () => planTratamiento,
  planTratamientoProcedimientos: () => planTratamientoProcedimientos,
  preciosProcedimientos: () => preciosProcedimientos,
  productos: () => productos,
  recibos: () => recibos,
  rolPermiso: () => rolPermiso,
  roles: () => roles,
  stockActual: () => stockActual,
  tipoAntecedente: () => tipoAntecedente,
  usuariosLogin: () => usuariosLogin,
  salidasDinero: () => salidasDinero,
  insumosProcedimiento: () => insumosProcedimiento,
  presupuestos: () => presupuestos,
  presupuestoDetalles: () => presupuestoDetalles,
});
module.exports = __toCommonJS(schema_exports);
var import_mysql_core = require("drizzle-orm/mysql-core");
var import_drizzle_orm = require("drizzle-orm");
const ausenciasDentistas = (0, import_mysql_core.mysqlTable)(
  "ausencias_dentistas",
  {
    idAusencia: (0, import_mysql_core.int)("id_ausencia").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "cascade" }),
    tipo: (0, import_mysql_core.mysqlEnum)("tipo", ["vacaciones", "no_disponibilidad"]).notNull(),
    fechaInicio: (0, import_mysql_core.date)("fecha_inicio", { mode: "string" }).notNull(),
    fechaFin: (0, import_mysql_core.date)("fecha_fin", { mode: "string" }).notNull(),
    horaInicio: (0, import_mysql_core.time)("hora_inicio"),
    horaFin: (0, import_mysql_core.time)("hora_fin"),
    motivo: (0, import_mysql_core.varchar)({ length: 255 }),
    creadoPor: (0, import_mysql_core.int)("creado_por").references(() => usuariosLogin.idUsuario, { onDelete: "set null" }),
    createdAt: (0, import_mysql_core.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updatedAt: (0, import_mysql_core.timestamp)("updated_at", { mode: "string" }).defaultNow().onUpdateNow()
  },
  (table) => [
    (0, import_mysql_core.index)("idx_ausencias_dentista").on(table.idDentista),
    (0, import_mysql_core.index)("idx_ausencias_clinica").on(table.idClinica),
    (0, import_mysql_core.index)("idx_ausencias_fechas").on(table.idDentista, table.fechaInicio, table.fechaFin),
    (0, import_mysql_core.primaryKey)({ columns: [table.idAusencia], name: "ausencias_dentistas_id_ausencia" })
  ]
);
const adminsSaas = (0, import_mysql_core.mysqlTable)(
  "admins_saas",
  {
    idAdmin: (0, import_mysql_core.int)("id_admin").autoincrement().notNull(),
    nombre: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    usuario: (0, import_mysql_core.varchar)({ length: 150 }).notNull(),
    passwordHash: (0, import_mysql_core.varchar)("password_hash", { length: 255 }).notNull(),
    idRol: (0, import_mysql_core.int)("id_rol").notNull().references(() => roles.idRol, { onDelete: "restrict" }),
    ultimoAcceso: (0, import_mysql_core.timestamp)("ultimo_acceso", { mode: "string" }),
    activo: (0, import_mysql_core.tinyint)().default(1)
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idAdmin], name: "admins_saas_id_admin" }),
    (0, import_mysql_core.unique)("uq_admin_email").on(table.usuario),
    (0, import_mysql_core.unique)("usuario").on(table.usuario)
  ]
);
const antecedentes = (0, import_mysql_core.mysqlTable)(
  "antecedentes",
  {
    idAntecedente: (0, import_mysql_core.int)("id_antecedente").autoincrement().notNull(),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idTipoAntecedente: (0, import_mysql_core.int)("id_tipo_antecedente").notNull().references(() => tipoAntecedente.idTipo, { onDelete: "restrict" }),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idAntecedente], name: "antecedentes_id_antecedente" })
  ]
);
const archivosClinicas = (0, import_mysql_core.mysqlTable)(
  "archivos_clinicas",
  {
    idArchivo: (0, import_mysql_core.int)("id_archivo").autoincrement().notNull(),
    idConsulta: (0, import_mysql_core.int)("id_consulta").references(() => consultas.idConsulta, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    tipo: (0, import_mysql_core.mysqlEnum)(["Intraoral", "Extraoral", "Panoramica", "Periapical", "Documento_Medico", "Consentimiento_Informado", "Otro"]).default("Otro"),
    nombreArchivo: (0, import_mysql_core.varchar)("nombre_archivo", { length: 100 }),
    descripcion: (0, import_mysql_core.text)(),
    fechaSubida: (0, import_mysql_core.timestamp)("fecha_subida", { mode: "string" }).defaultNow(),
    rutaArchivo: (0, import_mysql_core.varchar)("ruta_archivo", { length: 255 })
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idArchivo], name: "archivos_clinicas_id_archivo" })
  ]
);
const auditoria = (0, import_mysql_core.mysqlTable)(
  "auditoria",
  {
    idAudit: (0, import_mysql_core.int)("id_audit").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").references(() => clinicas.idClinica, { onDelete: "set null" }),
    entidad: (0, import_mysql_core.varchar)({ length: 100 }),
    idEntidad: (0, import_mysql_core.int)("id_entidad"),
    accion: (0, import_mysql_core.varchar)({ length: 50 }),
    usuario: (0, import_mysql_core.varchar)({ length: 150 }),
    detalle: (0, import_mysql_core.json)(),
    ipOrigen: (0, import_mysql_core.varchar)("ip_origen", { length: 45 }),
    userAgent: (0, import_mysql_core.varchar)("user_agent", { length: 255 }),
    fecha: (0, import_mysql_core.timestamp)({ mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idAudit], name: "auditoria_id_audit" })
  ]
);
const bloquesDisponibilidad = (0, import_mysql_core.mysqlTable)(
  "bloques_disponibilidad",
  {
    idBloque: (0, import_mysql_core.int)("id_bloque").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    diaSemana: (0, import_mysql_core.mysqlEnum)("dia_semana", ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]).notNull(),
    horaInicio: (0, import_mysql_core.time)("hora_inicio").notNull(),
    horaFin: (0, import_mysql_core.time)("hora_fin").notNull(),
    activo: (0, import_mysql_core.tinyint)().default(1)
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idBloque], name: "bloques_disponibilidad_id_bloque" })
  ]
);
const catalogoDiagnosticos = (0, import_mysql_core.mysqlTable)(
  "catalogo_diagnosticos",
  {
    idDiagnostico: (0, import_mysql_core.int)("id_diagnostico").autoincrement().notNull(),
    nombre: (0, import_mysql_core.varchar)({ length: 50 }).notNull(),
    tipo: (0, import_mysql_core.mysqlEnum)(["Diente", "Superficie"]).notNull(),
    colorIcon: (0, import_mysql_core.varchar)("color_icon", { length: 10 }),
    simbolo: (0, import_mysql_core.varchar)({ length: 20 }),
    idClinica: (0, import_mysql_core.int)("id_clinica").references(() => clinicas.idClinica, { onDelete: "cascade" })
  },
  (table) => [
    (0, import_mysql_core.index)("idx_diagnosticos_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idDiagnostico], name: "catalogo_diagnosticos_id_diagnostico" })
  ]
);
const catalogoProcedimientos = (0, import_mysql_core.mysqlTable)(
  "catalogo_procedimientos",
  {
    idCatalogoProcedimiento: (0, import_mysql_core.int)("id_catalogo_procedimiento").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    nombre: (0, import_mysql_core.varchar)({ length: 150 }).notNull(),
    descripcion: (0, import_mysql_core.text)(),
    activo: (0, import_mysql_core.tinyint)().default(1),
    color: (0, import_mysql_core.varchar)({ length: 7 }).default("#00676E").notNull()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idCatalogoProcedimiento], name: "catalogo_procedimientos_id_catalogo_procedimiento" })
  ]
);
const citas = (0, import_mysql_core.mysqlTable)(
  "citas",
  {
    idCita: (0, import_mysql_core.int)("id_cita").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    fechaCita: (0, import_mysql_core.date)("fecha_cita", { mode: "string" }).notNull(),
    horaInicio: (0, import_mysql_core.time)("hora_inicio").notNull(),
    horaFin: (0, import_mysql_core.time)("hora_fin").notNull(),
    estado: (0, import_mysql_core.mysqlEnum)(["Pendiente", "Confirmada", "Cancelada", "Completada", "Asistió", "No asistió"]).notNull(),
    idProcedimiento: (0, import_mysql_core.int)("id_procedimiento").references(() => catalogoProcedimientos.idCatalogoProcedimiento),
    notas: (0, import_mysql_core.text)(),
    creadoPor: (0, import_mysql_core.mysqlEnum)("creado_por", ["Paciente", "Recepcionista", "Dentista"]).notNull()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idCita], name: "citas_id_cita" }),
    (0, import_mysql_core.unique)("unica_cita").on(table.idDentista, table.fechaCita, table.horaInicio)
  ]
);
const clinicas = (0, import_mysql_core.mysqlTable)(
  "clinicas",
  {
    idClinica: (0, import_mysql_core.int)("id_clinica").autoincrement().notNull(),
    nombre: (0, import_mysql_core.varchar)({ length: 150 }).notNull(),
    subdominio: (0, import_mysql_core.varchar)({ length: 100 }),
    logoUrl: (0, import_mysql_core.varchar)("logo_url", { length: 255 }),
    colorPrincipal: (0, import_mysql_core.varchar)("color_principal", { length: 7 }),
    direccion: (0, import_mysql_core.text)(),
    telefono: (0, import_mysql_core.varchar)({ length: 15 }),
    correoContacto: (0, import_mysql_core.varchar)("correo_contacto", { length: 100 }),
    planSaas: (0, import_mysql_core.mysqlEnum)("plan_saas", ["B\xE1sico", "Pro", "Premium"]).default("B\xE1sico"),
    limitePacientes: (0, import_mysql_core.int)("limite_pacientes"),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow(),
    activo: (0, import_mysql_core.tinyint)().default(1),
    colorSecundario: (0, import_mysql_core.varchar)("color_secundario", { length: 7 }).default("#D8F0F2").notNull(),
    colorExtra: (0, import_mysql_core.varchar)("color_extra", { length: 7 }).default("#ff7701").notNull()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idClinica], name: "clinicas_id_clinica" }),
    (0, import_mysql_core.unique)("subdominio").on(table.subdominio)
  ]
);
const configuracionClinica = (0, import_mysql_core.mysqlTable)(
  "configuracion_clinica",
  {
    idConfig: (0, import_mysql_core.int)("id_config").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").references(() => dentistas.idDentista, { onDelete: "set null" }),
    tiempoAnticipacionCancelacion: (0, import_mysql_core.int)("tiempo_anticipacion_cancelacion"),
    maxCitasDia: (0, import_mysql_core.int)("max_citas_dia").default(0),
    permiteAgendamientoOnline: (0, import_mysql_core.tinyint)("permite_agendamiento_online").default(1),
    toleranciaLlegadaMinutos: (0, import_mysql_core.int)("tolerancia_llegada_minutos").default(0),
    permitirReservaSuperpuesta: (0, import_mysql_core.tinyint)("permitir_reserva_superpuesta").default(0),
    zonaHoraria: (0, import_mysql_core.varchar)("zona_horaria", { length: 50 }),
    fechaActualizacion: (0, import_mysql_core.timestamp)("fecha_actualizacion", { mode: "string" }).defaultNow().onUpdateNow(),
    requiereAnticipo: (0, import_mysql_core.tinyint)("requiere_anticipo").default(0),
    duracionBloque: (0, import_mysql_core.int)("duracion_bloque").default(60),
    tiempoEntreCitas: (0, import_mysql_core.int)("tiempo_entre_citas").default(10),
    numeracionOdontograma: (0, import_mysql_core.mysqlEnum)("numeracion_odontograma", ["FDI", "Universal"]).default("FDI"),
    diasLaborales: (0, import_mysql_core.json)("dias_laborales"),
    horaInicioClinica: (0, import_mysql_core.time)("hora_inicio_clinica"),
    horaFinClinica: (0, import_mysql_core.time)("hora_fin_clinica")
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idConfig], name: "configuracion_clinica_id_config" })
  ]
);
const consultas = (0, import_mysql_core.mysqlTable)(
  "consultas",
  {
    idConsulta: (0, import_mysql_core.int)("id_consulta").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "restrict" }),
    motivoConsulta: (0, import_mysql_core.text)("motivo_consulta"),
    examenExtraoral: (0, import_mysql_core.text)("examen_extraoral"),
    examenIntraoral: (0, import_mysql_core.text)("examen_intraoral"),
    fechaConsulta: (0, import_mysql_core.timestamp)("fecha_consulta", { mode: "string" }).defaultNow(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    proximaCita: (0, import_mysql_core.date)("proxima_cita", { mode: "string" }),
    notas: (0, import_mysql_core.text)()
  },
  (table) => [
    (0, import_mysql_core.index)("idx_citas_paciente").on(table.idPaciente),
    (0, import_mysql_core.primaryKey)({ columns: [table.idConsulta], name: "consultas_id_consulta" })
  ]
);
const cuotasTratamiento = (0, import_mysql_core.mysqlTable)(
  "cuotas_tratamiento",
  {
    idCuota: (0, import_mysql_core.int)("id_cuota").autoincrement().notNull(),
    idPlan: (0, import_mysql_core.int)("id_plan").notNull().references(() => planTratamiento.idPlan, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade", onUpdate: "cascade" }),
    monto: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    fechaProgramada: (0, import_mysql_core.date)("fecha_programada", { mode: "string" }).notNull(),
    pagada: (0, import_mysql_core.tinyint)().default(0)
  },
  (table) => [
    (0, import_mysql_core.index)("idx_cuotas_paciente").on(table.idPaciente),
    (0, import_mysql_core.primaryKey)({ columns: [table.idCuota], name: "cuotas_tratamiento_id_cuota" })
  ]
);
const datosFacturacion = (0, import_mysql_core.mysqlTable)(
  "datos_facturacion",
  {
    idDatoFacturacion: (0, import_mysql_core.int)("id_dato_facturacion").autoincrement().notNull(),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    rfc: (0, import_mysql_core.varchar)({ length: 20 }),
    razonSocial: (0, import_mysql_core.varchar)("razon_social", { length: 150 }),
    direccionFiscal: (0, import_mysql_core.text)("direccion_fiscal")
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idDatoFacturacion], name: "datos_facturacion_id_dato_facturacion" })
  ]
);
const dentistas = (0, import_mysql_core.mysqlTable)(
  "dentistas",
  {
    idDentista: (0, import_mysql_core.int)("id_dentista").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    nombre: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    apellidoPaterno: (0, import_mysql_core.varchar)("apellido_paterno", { length: 100 }),
    apellidoMaterno: (0, import_mysql_core.varchar)("apellido_materno", { length: 100 }),
    telefono: (0, import_mysql_core.varchar)({ length: 15 }),
    correo: (0, import_mysql_core.varchar)({ length: 100 }),
    especialidad: (0, import_mysql_core.varchar)({ length: 100 }),
    color: (0, import_mysql_core.varchar)({ length: 7 }).default("#00676E"),
    activo: (0, import_mysql_core.tinyint)().default(1),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idDentista], name: "dentistas_id_dentista" })
  ]
);
const examenClinicoInicialExtraoral = (0, import_mysql_core.mysqlTable)(
  "examen_clinico_inicial_extraoral",
  {
    idExtraoral: (0, import_mysql_core.int)("id_extraoral").autoincrement().notNull(),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    cabeza: (0, import_mysql_core.text)(),
    cara: (0, import_mysql_core.text)(),
    atm: (0, import_mysql_core.text)(),
    ganglios: (0, import_mysql_core.text)(),
    labios: (0, import_mysql_core.text)(),
    senalesParticulares: (0, import_mysql_core.text)("senales_particulares")
  },
  (table) => [
    (0, import_mysql_core.index)("id_paciente").on(table.idPaciente),
    (0, import_mysql_core.primaryKey)({ columns: [table.idExtraoral], name: "examen_clinico_inicial_extraoral_id_extraoral" })
  ]
);
const examenClinicoInicialIntraoral = (0, import_mysql_core.mysqlTable)(
  "examen_clinico_inicial_intraoral",
  {
    idIntraoral: (0, import_mysql_core.int)("id_intraoral").autoincrement().notNull(),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    encia: (0, import_mysql_core.text)(),
    orofaringe: (0, import_mysql_core.text)(),
    lengua: (0, import_mysql_core.text)(),
    pisoBoca: (0, import_mysql_core.text)("piso_boca"),
    paladarDuro: (0, import_mysql_core.text)("paladar_duro"),
    tipoOclusion: (0, import_mysql_core.text)("tipo_oclusion"),
    paladarBlando: (0, import_mysql_core.text)("paladar_blando"),
    rebordeResidual: (0, import_mysql_core.text)("reborde_residual")
  },
  (table) => [
    (0, import_mysql_core.index)("id_paciente").on(table.idPaciente),
    (0, import_mysql_core.primaryKey)({ columns: [table.idIntraoral], name: "examen_clinico_inicial_intraoral_id_intraoral" })
  ]
);
const lotesProductos = (0, import_mysql_core.mysqlTable)(
  "lotes_productos",
  {
    idLote: (0, import_mysql_core.int)("id_lote").autoincrement().notNull(),
    idProducto: (0, import_mysql_core.int)("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "restrict", onUpdate: "cascade" }),
    numeroLote: (0, import_mysql_core.varchar)("numero_lote", { length: 50 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    fechaCaducidad: (0, import_mysql_core.date)("fecha_caducidad", { mode: "string" }),
    cantidadInicial: (0, import_mysql_core.int)("cantidad_inicial").default(0)
  },
  (table) => [
    (0, import_mysql_core.index)("idx_lotes_productos_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idLote], name: "lotes_productos_id_lote" })
  ]
);
const materialesUsados = (0, import_mysql_core.mysqlTable)(
  "materiales_usados",
  {
    idMaterialUsado: (0, import_mysql_core.int)("id_material_usado").autoincrement().notNull(),
    idOdontogramaProcedimiento: (0, import_mysql_core.int)("id_odontograma_procedimiento").notNull(),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente),
    idProducto: (0, import_mysql_core.int)("id_producto").notNull().references(() => productos.idProducto),
    idLote: (0, import_mysql_core.int)("id_lote").references(() => lotesProductos.idLote),
    cantidad: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).notNull(),
    precioUnitario: (0, import_mysql_core.decimal)("precio_unitario", { precision: 10, scale: 2 })
  },
  (table) => [
    (0, import_mysql_core.index)("fk_mat_procedimiento").on(table.idOdontogramaProcedimiento),
    (0, import_mysql_core.index)("idx_mat_lote").on(table.idLote),
    (0, import_mysql_core.primaryKey)({ columns: [table.idMaterialUsado], name: "materiales_usados_id_material_usado" })
  ]
);
const movimientosInventario = (0, import_mysql_core.mysqlTable)(
  "movimientos_inventario",
  {
    idMovimiento: (0, import_mysql_core.int)("id_movimiento").autoincrement().notNull(),
    idProducto: (0, import_mysql_core.int)("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "restrict", onUpdate: "cascade" }),
    idLote: (0, import_mysql_core.int)("id_lote").references(() => lotesProductos.idLote, { onDelete: "set null" }),
    tipo: (0, import_mysql_core.mysqlEnum)(["Entrada", "Salida"]).notNull(),
    cantidad: (0, import_mysql_core.int)().notNull(),
    motivo: (0, import_mysql_core.text)(),
    fechaMovimiento: (0, import_mysql_core.timestamp)("fecha_movimiento", { mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.index)("idx_movimientos_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idMovimiento], name: "movimientos_inventario_id_movimiento" })
  ]
);
const odontogramaDiagnosticos = (0, import_mysql_core.mysqlTable)(
  "odontograma_diagnosticos",
  {
    idDiente: (0, import_mysql_core.int)("id_diente").autoincrement().notNull(),
    idOdontograma: (0, import_mysql_core.int)("id_odontograma").notNull().references(() => odontogramas.idOdontograma, { onDelete: "cascade" }),
    idCatalogoDiagnostico: (0, import_mysql_core.int)("id_catalogo_diagnostico").notNull().references(() => catalogoDiagnosticos.idDiagnostico, { onDelete: "restrict" }),
    numeroDiente: (0, import_mysql_core.varchar)("numero_diente", { length: 8 }),
    superficie: (0, import_mysql_core.mysqlEnum)(["O", "M", "D", "V", "L", "I", "P"]),
    observaciones: (0, import_mysql_core.text)(),
    fechaActualizacion: (0, import_mysql_core.timestamp)("fecha_actualizacion", { mode: "string" }).defaultNow().onUpdateNow(),
    otro: (0, import_mysql_core.text)(),
    tipoAfectacion: (0, import_mysql_core.mysqlEnum)("tipo_afectacion", ["CORONA", "RAIZ", "PIEZA_COMPLETA"]).default("CORONA").notNull(),
    numeroRaiz: (0, import_mysql_core.tinyint)("numero_raiz")
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idDiente], name: "odontograma_diagnosticos_id_diente" })
  ]
);
const odontogramaProcedimientos = (0, import_mysql_core.mysqlTable)(
  "odontograma_procedimientos",
  {
    idOdontogramaProcedimiento: (0, import_mysql_core.int)("id_odontograma_procedimiento").autoincrement().notNull(),
    idOdontograma: (0, import_mysql_core.int)("id_odontograma").notNull().references(() => odontogramas.idOdontograma),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista),
    idPlan: (0, import_mysql_core.int)("id_plan").notNull().references(() => planTratamiento.idPlan),
    idPlanTratamientoProcedimiento: (0, import_mysql_core.int)("id_plan_tratamiento_procedimiento").notNull().references(() => planTratamientoProcedimientos.idProcedimiento),
    descripcion: (0, import_mysql_core.varchar)("descripcion", { length: 255 }),
    fechaRealizacion: (0, import_mysql_core.datetime)("fecha_realizacion", { mode: "string" }).default(import_drizzle_orm.sql`(CURRENT_TIMESTAMP)`),
    idDiagnostico: (0, import_mysql_core.int)("id_diagnostico").notNull()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idOdontogramaProcedimiento], name: "odontograma_procedimientos_id_odontograma_procedimiento" })
  ]
);
const odontogramaVersiones = (0, import_mysql_core.mysqlTable)(
  "odontograma_versiones",
  {
    idVersion: (0, import_mysql_core.int)("id_version").autoincrement().notNull(),
    idOdontograma: (0, import_mysql_core.int)("id_odontograma").notNull().references(() => odontogramas.idOdontograma, { onDelete: "cascade" }),
    numeroVersion: (0, import_mysql_core.int)("numero_version").notNull(),
    snapshot: (0, import_mysql_core.json)(),
    fechaCreacion: (0, import_mysql_core.timestamp)("fecha_creacion", { mode: "string" }).defaultNow(),
    creadoPor: (0, import_mysql_core.int)("creado_por").references(() => usuariosLogin.idUsuario, { onDelete: "set null" })
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idVersion], name: "odontograma_versiones_id_version" })
  ]
);
const odontogramas = (0, import_mysql_core.mysqlTable)(
  "odontogramas",
  {
    idOdontograma: (0, import_mysql_core.int)("id_odontograma").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    version: (0, import_mysql_core.int)().default(1),
    estado: (0, import_mysql_core.mysqlEnum)(["Activo", "Archivado"]).default("Activo"),
    notaCierre: (0, import_mysql_core.text)("nota_cierre"),
    fechaCreacion: (0, import_mysql_core.timestamp)("fecha_creacion", { mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idOdontograma], name: "odontogramas_id_odontograma" })
  ]
);
const pacienteAtributosExtra = (0, import_mysql_core.mysqlTable)(
  "paciente_atributos_extra",
  {
    idAttr: (0, import_mysql_core.int)("id_attr").autoincrement().notNull(),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    clave: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    valor: (0, import_mysql_core.text)(),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idAttr], name: "paciente_atributos_extra_id_attr" })
  ]
);
const pacientes = (0, import_mysql_core.mysqlTable)(
  "pacientes",
  {
    idPaciente: (0, import_mysql_core.int)("id_paciente").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    nombre: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    apellidoPaterno: (0, import_mysql_core.varchar)("apellido_paterno", { length: 100 }),
    apellidoMaterno: (0, import_mysql_core.varchar)("apellido_materno", { length: 100 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    fechaNacimiento: (0, import_mysql_core.date)("fecha_nacimiento", { mode: "string" }),
    sexo: (0, import_mysql_core.mysqlEnum)(["M", "F", "Otro"]).default("Otro"),
    telefono: (0, import_mysql_core.varchar)({ length: 15 }),
    correo: (0, import_mysql_core.varchar)({ length: 100 }),
    direccion: (0, import_mysql_core.text)(),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow(),
    activo: (0, import_mysql_core.tinyint)().default(1),
    escolaridad: (0, import_mysql_core.varchar)({ length: 100 }),
    ocupacion: (0, import_mysql_core.varchar)({ length: 100 }),
    requiereTutor: (0, import_mysql_core.tinyint)("requiere_tutor").default(0),
    nombreTutor: (0, import_mysql_core.varchar)("nombre_tutor", { length: 200 }),
    telefonoTutor: (0, import_mysql_core.varchar)("telefono_tutor", { length: 15 }),
    canalAdquisicion: (0, import_mysql_core.varchar)("canal_adquisicion", { length: 100 }),
    saldoFavor: (0, import_mysql_core.decimal)("saldo_favor", { precision: 10, scale: 2 }).default("0.00"),
  },
  (table) => [
    (0, import_mysql_core.index)("id_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idPaciente], name: "pacientes_id_paciente" })
  ]
);
const pacientesLogin = (0, import_mysql_core.mysqlTable)(
  "pacientes_login",
  {
    idPacienteLogin: (0, import_mysql_core.int)("id_paciente_login").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    usuario: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    passwordHash: (0, import_mysql_core.varchar)("password_hash", { length: 255 }).notNull(),
    ultimoAcceso: (0, import_mysql_core.timestamp)("ultimo_acceso", { mode: "string" }),
    activo: (0, import_mysql_core.tinyint)().default(1)
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idPacienteLogin], name: "pacientes_login_id_paciente_login" }),
    (0, import_mysql_core.unique)("uq_pacientes_login").on(table.usuario, table.idClinica)
  ]
);
const pagos = (0, import_mysql_core.mysqlTable)(
  "pagos",
  {
    idPago: (0, import_mysql_core.int)("id_pago").autoincrement().notNull(),
    idCuota: (0, import_mysql_core.int)("id_cuota").references(() => cuotasTratamiento.idCuota, { onDelete: "set null" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica),
    idPlan: (0, import_mysql_core.int)("id_plan").references(() => planTratamiento.idPlan, { onDelete: "set null" }),
    monto: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).notNull(),
    metodoPago: (0, import_mysql_core.mysqlEnum)("metodo_pago", ["Efectivo", "Tarjeta", "Transferencia"]).default("Efectivo"),
    fechaPago: (0, import_mysql_core.timestamp)("fecha_pago", { mode: "string" }).defaultNow(),
    referencia: (0, import_mysql_core.varchar)({ length: 100 }),
    tipoPago: (0, import_mysql_core.mysqlEnum)("tipo_pago", ["Tratamiento", "Anticipo", "Uso de Saldo"]).default("Tratamiento"),
    nota: (0, import_mysql_core.text)()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idPago], name: "pagos_id_pago" })
  ]
);
const periodontogramaDetalles = (0, import_mysql_core.mysqlTable)(
  "periodontograma_detalles",
  {
    idDetalle: (0, import_mysql_core.int)("id_detalle").autoincrement().notNull(),
    idPeriodontograma: (0, import_mysql_core.int)("id_periodontograma").notNull().references(() => periodontogramas.idPeriodontograma, { onDelete: "cascade" }),
    numeroDiente: (0, import_mysql_core.tinyint)("numero_diente").notNull(),
    cara: (0, import_mysql_core.mysqlEnum)(["V", "L"]).notNull(),
    margenM: (0, import_mysql_core.decimal)("margen_m", { precision: 4, scale: 1 }),
    margenC: (0, import_mysql_core.decimal)("margen_c", { precision: 4, scale: 1 }),
    margenD: (0, import_mysql_core.decimal)("margen_d", { precision: 4, scale: 1 }),
    sondajeM: (0, import_mysql_core.decimal)("sondaje_m", { precision: 4, scale: 1 }),
    sondajeC: (0, import_mysql_core.decimal)("sondaje_c", { precision: 4, scale: 1 }),
    sondajeD: (0, import_mysql_core.decimal)("sondaje_d", { precision: 4, scale: 1 }),
    sangradoM: (0, import_mysql_core.tinyint)("sangrado_m"),
    sangradoC: (0, import_mysql_core.tinyint)("sangrado_c"),
    sangradoD: (0, import_mysql_core.tinyint)("sangrado_d"),
    supuracionM: (0, import_mysql_core.tinyint)("supuracion_m"),
    supuracionC: (0, import_mysql_core.tinyint)("supuracion_c"),
    supuracionD: (0, import_mysql_core.tinyint)("supuracion_d"),
    placaM: (0, import_mysql_core.tinyint)("placa_m"),
    placaC: (0, import_mysql_core.tinyint)("placa_c"),
    placaD: (0, import_mysql_core.tinyint)("placa_d"),
    implante: (0, import_mysql_core.tinyint)().default(0),
    movilidad: (0, import_mysql_core.tinyint)(),
    furca: (0, import_mysql_core.tinyint)(),
    enciaQueratinizada: (0, import_mysql_core.decimal)("encia_queratinizada", { precision: 4, scale: 1 })
  },
  (table) => [
    (0, import_mysql_core.index)("idx_detalle_perio").on(table.idPeriodontograma),
    (0, import_mysql_core.primaryKey)({ columns: [table.idDetalle], name: "periodontograma_detalles_id_detalle" }),
    (0, import_mysql_core.unique)("id_periodontograma").on(table.idPeriodontograma, table.numeroDiente, table.cara)
  ]
);
const periodontogramas = (0, import_mysql_core.mysqlTable)(
  "periodontogramas",
  {
    idPeriodontograma: (0, import_mysql_core.int)("id_periodontograma").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow(),
    estado: (0, import_mysql_core.mysqlEnum)(["draft", "completed"]).default("draft"),
    notas: (0, import_mysql_core.text)(),
    notaCierre: (0, import_mysql_core.text)("nota_cierre"),
    createdAt: (0, import_mysql_core.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updatedAt: (0, import_mysql_core.timestamp)("updated_at", { mode: "string" })
  },
  (table) => [
    (0, import_mysql_core.index)("idx_paciente").on(table.idPaciente),
    (0, import_mysql_core.index)("idx_clinica").on(table.idClinica),
    (0, import_mysql_core.index)("idx_perio_paciente").on(table.idPaciente),
    (0, import_mysql_core.index)("idx_perio_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idPeriodontograma], name: "periodontogramas_id_periodontograma" })
  ]
);
const permisos = (0, import_mysql_core.mysqlTable)(
  "permisos",
  {
    idPermiso: (0, import_mysql_core.int)("id_permiso").autoincrement().notNull(),
    nombre: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    descripcion: (0, import_mysql_core.varchar)({ length: 255 })
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idPermiso], name: "permisos_id_permiso" })
  ]
);
const planTratamiento = (0, import_mysql_core.mysqlTable)(
  "plan_tratamiento",
  {
    idPlan: (0, import_mysql_core.int)("id_plan").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "restrict" }),
    nombrePlan: (0, import_mysql_core.varchar)("nombre_plan", { length: 100 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    fechaInicio: (0, import_mysql_core.date)("fecha_inicio", { mode: "string" }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    fechaFinEstimada: (0, import_mysql_core.date)("fecha_fin_estimada", { mode: "string" }),
    costoTotalInicial: (0, import_mysql_core.decimal)("costo_total_inicial", { precision: 10, scale: 2 }).default("0.00"),
    costoAjustado: (0, import_mysql_core.decimal)("costo_ajustado", { precision: 10, scale: 2 }).default("0.00"),
    razonAjuste: (0, import_mysql_core.text)("razon_ajuste"),
    planPago: (0, import_mysql_core.mysqlEnum)("plan_pago", ["Pago unico", "Cuotas"]).default("Pago unico"),
    estado: (0, import_mysql_core.mysqlEnum)(["En Progreso", "Completado", "Cancelado"]).default("En Progreso")
  },
  (table) => [
    (0, import_mysql_core.index)("idx_plan_paciente").on(table.idPaciente),
    (0, import_mysql_core.primaryKey)({ columns: [table.idPlan], name: "plan_tratamiento_id_plan" })
  ]
);
const planTratamientoProcedimientos = (0, import_mysql_core.mysqlTable)(
  "plan_tratamiento_procedimientos",
  {
    idProcedimiento: (0, import_mysql_core.int)("id_procedimiento").autoincrement().notNull(),
    idPlan: (0, import_mysql_core.int)("id_plan").notNull().references(() => planTratamiento.idPlan, { onDelete: "cascade" }),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idCatalogoProcedimiento: (0, import_mysql_core.int)("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "restrict" }),
    status: (0, import_mysql_core.mysqlEnum)(["Pendiente", "Realizado"]).default("Pendiente"),
    cantidad: (0, import_mysql_core.int)().default(1),
    precioUnitario: (0, import_mysql_core.decimal)("precio_unitario", { precision: 10, scale: 2 })
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idProcedimiento], name: "plan_tratamiento_procedimientos_id_procedimiento" })
  ]
);
const preciosProcedimientos = (0, import_mysql_core.mysqlTable)(
  "precios_procedimientos",
  {
    idPrecio: (0, import_mysql_core.int)("id_precio").autoincrement().notNull(),
    idCatalogoProcedimiento: (0, import_mysql_core.int)("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "cascade" }),
    precio: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).notNull()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idPrecio], name: "precios_procedimientos_id_precio" }),
    (0, import_mysql_core.unique)("id_catalogo_procedimiento").on(table.idCatalogoProcedimiento)
  ]
);
const productos = (0, import_mysql_core.mysqlTable)(
  "productos",
  {
    idProducto: (0, import_mysql_core.int)("id_producto").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    nombre: (0, import_mysql_core.varchar)({ length: 150 }).notNull(),
    descripcion: (0, import_mysql_core.text)(),
    unidadMedida: (0, import_mysql_core.varchar)("unidad_medida", { length: 50 }),
    costoUnitario: (0, import_mysql_core.decimal)("costo_unitario", { precision: 10, scale: 2 }).default("0.00"),
    activo: (0, import_mysql_core.tinyint)().default(1)
  },
  (table) => [
    (0, import_mysql_core.index)("idx_prod_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idProducto], name: "productos_id_producto" })
  ]
);
const recibos = (0, import_mysql_core.mysqlTable)(
  "recibos",
  {
    idRecibo: (0, import_mysql_core.int)("id_recibo").autoincrement().notNull(),
    idPago: (0, import_mysql_core.int)("id_pago").notNull().references(() => pagos.idPago, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    numeroRecibo: (0, import_mysql_core.varchar)("numero_recibo", { length: 100 }),
    fechaEmision: (0, import_mysql_core.timestamp)("fecha_emision", { mode: "string" }).defaultNow(),
    tipoComprobante: (0, import_mysql_core.mysqlEnum)("tipo_comprobante", ["Recibo", "Comprobante"]).default("Recibo"),
    total: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).notNull(),
    archivoUrl: (0, import_mysql_core.varchar)("archivo_url", { length: 255 }),
    generadoPor: (0, import_mysql_core.varchar)("generado_por", { length: 100 }),
    notas: (0, import_mysql_core.text)()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idRecibo], name: "recibos_id_recibo" })
  ]
);
const rolPermiso = (0, import_mysql_core.mysqlTable)(
  "rol_permiso",
  {
    idRol: (0, import_mysql_core.int)("id_rol").notNull().references(() => roles.idRol, { onDelete: "cascade" }),
    idPermiso: (0, import_mysql_core.int)("id_permiso").notNull().references(() => permisos.idPermiso, { onDelete: "cascade" })
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idRol, table.idPermiso], name: "rol_permiso_id_rol_id_permiso" })
  ]
);
const roles = (0, import_mysql_core.mysqlTable)(
  "roles",
  {
    idRol: (0, import_mysql_core.int)("id_rol").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").references(() => clinicas.idClinica, { onDelete: "cascade" }),
    nombreRol: (0, import_mysql_core.varchar)("nombre_rol", { length: 50 }).notNull(),
    descripcion: (0, import_mysql_core.varchar)({ length: 255 }),
    esBase: (0, import_mysql_core.tinyint)("es_base").default(0)
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idRol], name: "roles_id_rol" })
  ]
);
const stockActual = (0, import_mysql_core.mysqlTable)(
  "stock_actual",
  {
    idStock: (0, import_mysql_core.int)("id_stock").autoincrement().notNull(),
    idProducto: (0, import_mysql_core.int)("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull(),
    idLote: (0, import_mysql_core.int)("id_lote").references(() => lotesProductos.idLote, { onDelete: "set null" }),
    stockDisponible: (0, import_mysql_core.int)("stock_disponible").default(0),
    ultimaActualizacion: (0, import_mysql_core.timestamp)("ultima_actualizacion", { mode: "string" }).defaultNow().onUpdateNow()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idStock], name: "stock_actual_id_stock" }),
    (0, import_mysql_core.unique)("id_producto").on(table.idProducto, table.idLote),
    (0, import_mysql_core.unique)("uniq_stock").on(table.idProducto, table.idLote, table.idClinica)
  ]
);
const tipoAntecedente = (0, import_mysql_core.mysqlTable)(
  "tipo_antecedente",
  {
    idTipo: (0, import_mysql_core.int)("id_tipo").autoincrement().notNull(),
    nombre: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    tipo: (0, import_mysql_core.mysqlEnum)(["patologico", "no_patologico"]).notNull()
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idTipo], name: "tipo_antecedente_id_tipo" })
  ]
);
const usuariosLogin = (0, import_mysql_core.mysqlTable)(
  "usuarios_login",
  {
    idUsuario: (0, import_mysql_core.int)("id_usuario").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").references(() => dentistas.idDentista, { onDelete: "set null" }),
    usuario: (0, import_mysql_core.varchar)({ length: 100 }).notNull(),
    passwordHash: (0, import_mysql_core.varchar)("password_hash", { length: 255 }).notNull(),
    idRol: (0, import_mysql_core.int)("id_rol").notNull().references(() => roles.idRol, { onDelete: "restrict" }),
    ultimoAcceso: (0, import_mysql_core.timestamp)("ultimo_acceso", { mode: "string" }),
    activo: (0, import_mysql_core.tinyint)().default(1)
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idUsuario], name: "usuarios_login_id_usuario" }),
    (0, import_mysql_core.unique)("uq_usuarios_login").on(table.usuario, table.idClinica)
  ]
);
// Annotate the CommonJS export names for ESM import in node:

const presupuestos = (0, import_mysql_core.mysqlTable)(
  "presupuestos",
  {
    idPresupuesto: (0, import_mysql_core.int)("id_presupuesto").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    idPaciente: (0, import_mysql_core.int)("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
    idDentista: (0, import_mysql_core.int)("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "restrict" }),
    nombre: (0, import_mysql_core.varchar)({ length: 150 }),
    estado: (0, import_mysql_core.mysqlEnum)("estado", ["Borrador", "Activo", "Aceptado", "Rechazado", "Vencido"]).default("Activo"),
    descuentoPorcentaje: (0, import_mysql_core.decimal)("descuento_porcentaje", { precision: 5, scale: 2 }).default("0.00"),
    descuentoMonto: (0, import_mysql_core.decimal)("descuento_monto", { precision: 10, scale: 2 }).default("0.00"),
    subtotal: (0, import_mysql_core.decimal)("subtotal", { precision: 10, scale: 2 }).default("0.00"),
    total: (0, import_mysql_core.decimal)("total", { precision: 10, scale: 2 }).default("0.00"),
    notas: (0, import_mysql_core.text)("notas"),
    fechaCreacion: (0, import_mysql_core.timestamp)("fecha_creacion", { mode: "string" }).defaultNow(),
    fechaExpiracion: (0, import_mysql_core.date)("fecha_expiracion", { mode: "string" }),
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idPresupuesto], name: "presupuestos_id_presupuesto" })
  ]
);

const presupuestoDetalles = (0, import_mysql_core.mysqlTable)(
  "presupuesto_detalles",
  {
    idDetallePresupuesto: (0, import_mysql_core.int)("id_detalle_presupuesto").autoincrement().notNull(),
    idPresupuesto: (0, import_mysql_core.int)("id_presupuesto").notNull().references(() => presupuestos.idPresupuesto, { onDelete: "cascade" }),
    idCatalogoProcedimiento: (0, import_mysql_core.int)("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "restrict" }),
    numeroDiente: (0, import_mysql_core.varchar)("numero_diente", { length: 8 }),
    cantidad: (0, import_mysql_core.int)("cantidad").default(1),
    precioUnitario: (0, import_mysql_core.decimal)("precio_unitario", { precision: 10, scale: 2 }).notNull(),
    descuentoPorcentaje: (0, import_mysql_core.decimal)("descuento_porcentaje", { precision: 5, scale: 2 }).default("0.00"),
    descuentoMonto: (0, import_mysql_core.decimal)("descuento_monto", { precision: 10, scale: 2 }).default("0.00"),
    subtotal: (0, import_mysql_core.decimal)("subtotal", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idDetallePresupuesto], name: "presupuesto_detalles_id_detalle" })
  ]
);

0 && (module.exports = {
  adminsSaas,
  antecedentes,
  archivosClinicas,
  auditoria,
  ausenciasDentistas,
  bloquesDisponibilidad,
  catalogoDiagnosticos,
  catalogoProcedimientos,
  citas,
  clinicas,
  configuracionClinica,
  consultas,
  cuotasTratamiento,
  datosFacturacion,
  dentistas,
  examenClinicoInicialExtraoral,
  examenClinicoInicialIntraoral,
  lotesProductos,
  materialesUsados,
  movimientosInventario,
  odontogramaDiagnosticos,
  odontogramaProcedimientos,
  odontogramaVersiones,
  odontogramas,
  pacienteAtributosExtra,
  pacientes,
  pacientesLogin,
  pagos,
  periodontogramaDetalles,
  periodontogramas,
  permisos,
  planTratamiento,
  planTratamientoProcedimientos,
  preciosProcedimientos,
  productos,
  recibos,
  rolPermiso,
  roles,
  stockActual,
   tipoAntecedente,
  usuariosLogin,
  salidasDinero,
  insumosProcedimiento,
  presupuestos,
  presupuestoDetalles
});

const salidasDinero = (0, import_mysql_core.mysqlTable)(
  "salidas_dinero",
  {
    idSalida: (0, import_mysql_core.int)("id_salida").autoincrement().notNull(),
    idClinica: (0, import_mysql_core.int)("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
    motivo: (0, import_mysql_core.varchar)({ length: 255 }).notNull(),
    monto: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).notNull(),
    fechaSalida: (0, import_mysql_core.date)("fecha_salida", { mode: "string" }).notNull(),
    horaSalida: (0, import_mysql_core.time)("hora_salida").notNull(),
    fechaRegistro: (0, import_mysql_core.timestamp)("fecha_registro", { mode: "string" }).defaultNow()
  },
  (table) => [
    (0, import_mysql_core.index)("idx_salidas_clinica").on(table.idClinica),
    (0, import_mysql_core.primaryKey)({ columns: [table.idSalida], name: "salidas_dinero_id_salida" })
  ]
);

const insumosProcedimiento = (0, import_mysql_core.mysqlTable)(
  "insumos_procedimiento",
  {
    idInsumo: (0, import_mysql_core.int)("id_insumo").autoincrement().notNull(),
    idCatalogoProcedimiento: (0, import_mysql_core.int)("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "cascade" }),
    idProducto: (0, import_mysql_core.int)("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
    cantidad: (0, import_mysql_core.decimal)({ precision: 10, scale: 2 }).default("1.00").notNull(),
  },
  (table) => [
    (0, import_mysql_core.primaryKey)({ columns: [table.idInsumo], name: "insumos_procedimiento_id_insumo" })
  ]
);
