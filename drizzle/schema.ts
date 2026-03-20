import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, unique, int, varchar, timestamp, mysqlEnum, text, json, time, date, index, decimal, tinyint, datetime } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const ausenciasDentistas = mysqlTable("ausencias_dentistas", {
	idAusencia: int("id_ausencia").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idDentista: int("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "cascade" }),
	tipo: mysqlEnum("tipo", ['vacaciones', 'no_disponibilidad']).notNull(),
	fechaInicio: date("fecha_inicio", { mode: 'string' }).notNull(),
	fechaFin: date("fecha_fin", { mode: 'string' }).notNull(),
	horaInicio: time("hora_inicio"),
	horaFin: time("hora_fin"),
	motivo: varchar({ length: 255 }),
	creadoPor: int("creado_por").references(() => usuariosLogin.idUsuario, { onDelete: "set null" }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		index("idx_ausencias_dentista").on(table.idDentista),
		index("idx_ausencias_clinica").on(table.idClinica),
		index("idx_ausencias_fechas").on(table.idDentista, table.fechaInicio, table.fechaFin),
		primaryKey({ columns: [table.idAusencia], name: "ausencias_dentistas_id_ausencia" }),
	]);

export const adminsSaas = mysqlTable("admins_saas", {
	idAdmin: int("id_admin").autoincrement().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	usuario: varchar({ length: 150 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	idRol: int("id_rol").notNull().references(() => roles.idRol, { onDelete: "restrict" }),
	ultimoAcceso: timestamp("ultimo_acceso", { mode: 'string' }),
	activo: tinyint().default(1),
},
	(table) => [
		primaryKey({ columns: [table.idAdmin], name: "admins_saas_id_admin" }),
		unique("uq_admin_email").on(table.usuario),
		unique("usuario").on(table.usuario),
	]);

export const antecedentes = mysqlTable("antecedentes", {
	idAntecedente: int("id_antecedente").autoincrement().notNull(),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	idTipoAntecedente: int("id_tipo_antecedente").notNull().references(() => tipoAntecedente.idTipo, { onDelete: "restrict" }),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).defaultNow(),
},
	(table) => [
		primaryKey({ columns: [table.idAntecedente], name: "antecedentes_id_antecedente" }),
	]);

export const archivosClinicas = mysqlTable("archivos_clinicas", {
	idArchivo: int("id_archivo").autoincrement().notNull(),
	idConsulta: int("id_consulta").references(() => consultas.idConsulta, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	tipo: mysqlEnum(['Intraoral', 'Extraoral', 'Panoramica', 'Periapical', 'Documento_Medico', 'Consentimiento_Informado', 'Otro']).default('Otro'),
	nombreArchivo: varchar("nombre_archivo", { length: 100 }),
	descripcion: text(),
	fechaSubida: timestamp("fecha_subida", { mode: 'string' }).defaultNow(),
	rutaArchivo: varchar("ruta_archivo", { length: 255 }),
},
	(table) => [
		primaryKey({ columns: [table.idArchivo], name: "archivos_clinicas_id_archivo" }),
	]);

export const auditoria = mysqlTable("auditoria", {
	idAudit: int("id_audit").autoincrement().notNull(),
	idClinica: int("id_clinica").references(() => clinicas.idClinica, { onDelete: "set null" }),
	entidad: varchar({ length: 100 }),
	idEntidad: int("id_entidad"),
	accion: varchar({ length: 50 }),
	usuario: varchar({ length: 150 }),
	detalle: json(),
	ipOrigen: varchar("ip_origen", { length: 45 }),
	userAgent: varchar("user_agent", { length: 255 }),
	fecha: timestamp({ mode: 'string' }).defaultNow(),
},
	(table) => [
		primaryKey({ columns: [table.idAudit], name: "auditoria_id_audit" }),
	]);

export const bloquesDisponibilidad = mysqlTable("bloques_disponibilidad", {
	idBloque: int("id_bloque").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	diaSemana: mysqlEnum("dia_semana", ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']).notNull(),
	horaInicio: time("hora_inicio").notNull(),
	horaFin: time("hora_fin").notNull(),
	activo: tinyint().default(1),
},
	(table) => [
		primaryKey({ columns: [table.idBloque], name: "bloques_disponibilidad_id_bloque" }),
	]);

export const catalogoDiagnosticos = mysqlTable("catalogo_diagnosticos", {
	idDiagnostico: int("id_diagnostico").autoincrement().notNull(),
	nombre: varchar({ length: 50 }).notNull(),
	tipo: mysqlEnum(['Diente', 'Superficie']).notNull(),
	colorIcon: varchar("color_icon", { length: 10 }),
	simbolo: varchar({ length: 20 }),
	idClinica: int("id_clinica").references(() => clinicas.idClinica, { onDelete: "cascade" }),
},
	(table) => [
		index("idx_diagnosticos_clinica").on(table.idClinica),
		primaryKey({ columns: [table.idDiagnostico], name: "catalogo_diagnosticos_id_diagnostico" }),
	]);

export const catalogoProcedimientos = mysqlTable("catalogo_procedimientos", {
	idCatalogoProcedimiento: int("id_catalogo_procedimiento").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	nombre: varchar({ length: 150 }).notNull(),
	descripcion: text(),
	activo: tinyint().default(1),
	color: varchar({ length: 7 }).default('#00676E').notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idCatalogoProcedimiento], name: "catalogo_procedimientos_id_catalogo_procedimiento" }),
	]);

export const citas = mysqlTable("citas", {
	idCita: int("id_cita").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente),
	idDentista: int("id_dentista").notNull().references(() => dentistas.idDentista),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaCita: date("fecha_cita", { mode: 'string' }).notNull(),
	horaInicio: time("hora_inicio").notNull(),
	horaFin: time("hora_fin").notNull(),
	estado: mysqlEnum(['Pendiente', 'Confirmada', 'Cancelada', 'Completada']).notNull(),
	idProcedimiento: int("id_procedimiento").references(() => catalogoProcedimientos.idCatalogoProcedimiento),
	notas: text(),
	creadoPor: mysqlEnum("creado_por", ['Paciente', 'Recepcionista', 'Dentista']).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idCita], name: "citas_id_cita" }),
		unique("unica_cita").on(table.idDentista, table.fechaCita, table.horaInicio),
	]);

export const clinicas = mysqlTable("clinicas", {
	idClinica: int("id_clinica").autoincrement().notNull(),
	nombre: varchar({ length: 150 }).notNull(),
	subdominio: varchar({ length: 100 }),
	logoUrl: varchar("logo_url", { length: 255 }),
	colorPrincipal: varchar("color_principal", { length: 7 }),
	direccion: text(),
	telefono: varchar({ length: 15 }),
	correoContacto: varchar("correo_contacto", { length: 100 }),
	planSaas: mysqlEnum("plan_saas", ['Básico', 'Pro', 'Premium']).default('Básico'),
	limitePacientes: int("limite_pacientes"),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).defaultNow(),
	activo: tinyint().default(1),
	colorSecundario: varchar("color_secundario", { length: 7 }).default('#D8F0F2').notNull(),
	colorExtra: varchar("color_extra", { length: 7 }).default('#ff7701').notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idClinica], name: "clinicas_id_clinica" }),
		unique("subdominio").on(table.subdominio),
	]);

export const configuracionClinica = mysqlTable("configuracion_clinica", {
	idConfig: int("id_config").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idDentista: int("id_dentista").references(() => dentistas.idDentista, { onDelete: "set null" }),
	tiempoAnticipacionCancelacion: int("tiempo_anticipacion_cancelacion"),
	maxCitasDia: int("max_citas_dia").default(0),
	permiteAgendamientoOnline: tinyint("permite_agendamiento_online").default(1),
	toleranciaLlegadaMinutos: int("tolerancia_llegada_minutos").default(0),
	permitirReservaSuperpuesta: tinyint("permitir_reserva_superpuesta").default(0),
	zonaHoraria: varchar("zona_horaria", { length: 50 }),
	fechaActualizacion: timestamp("fecha_actualizacion", { mode: 'string' }).defaultNow().onUpdateNow(),
	requiereAnticipo: tinyint("requiere_anticipo").default(0),
	duracionBloque: int("duracion_bloque").default(60),
	tiempoEntreCitas: int("tiempo_entre_citas").default(10),
	numeracionOdontograma: mysqlEnum("numeracion_odontograma", ['FDI', 'Universal']).default('FDI'),
	diasLaborales: json("dias_laborales"),
	horaInicioClinica: time("hora_inicio_clinica"),
	horaFinClinica: time("hora_fin_clinica"),
},
	(table) => [
		primaryKey({ columns: [table.idConfig], name: "configuracion_clinica_id_config" }),
	]);

export const consultas = mysqlTable("consultas", {
	idConsulta: int("id_consulta").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	idDentista: int("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "restrict" }),
	motivoConsulta: text("motivo_consulta"),
	examenExtraoral: text("examen_extraoral"),
	examenIntraoral: text("examen_intraoral"),
	fechaConsulta: timestamp("fecha_consulta", { mode: 'string' }).defaultNow(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	proximaCita: date("proxima_cita", { mode: 'string' }),
	notas: text(),
},
	(table) => [
		index("idx_citas_paciente").on(table.idPaciente),
		primaryKey({ columns: [table.idConsulta], name: "consultas_id_consulta" }),
	]);

export const cuotasTratamiento = mysqlTable("cuotas_tratamiento", {
	idCuota: int("id_cuota").autoincrement().notNull(),
	idPlan: int("id_plan").notNull().references(() => planTratamiento.idPlan, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade", onUpdate: "cascade" }),
	monto: decimal({ precision: 10, scale: 2 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaProgramada: date("fecha_programada", { mode: 'string' }).notNull(),
	pagada: tinyint().default(0),
},
	(table) => [
		index("idx_cuotas_paciente").on(table.idPaciente),
		primaryKey({ columns: [table.idCuota], name: "cuotas_tratamiento_id_cuota" }),
	]);

export const datosFacturacion = mysqlTable("datos_facturacion", {
	idDatoFacturacion: int("id_dato_facturacion").autoincrement().notNull(),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	rfc: varchar({ length: 20 }),
	razonSocial: varchar("razon_social", { length: 150 }),
	direccionFiscal: text("direccion_fiscal"),
},
	(table) => [
		primaryKey({ columns: [table.idDatoFacturacion], name: "datos_facturacion_id_dato_facturacion" }),
	]);

export const dentistas = mysqlTable("dentistas", {
	idDentista: int("id_dentista").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	nombre: varchar({ length: 100 }).notNull(),
	apellidoPaterno: varchar("apellido_paterno", { length: 100 }),
	apellidoMaterno: varchar("apellido_materno", { length: 100 }),
	telefono: varchar({ length: 15 }),
	correo: varchar({ length: 100 }),
	especialidad: varchar({ length: 100 }),
	activo: tinyint().default(1),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).defaultNow(),
},
	(table) => [
		primaryKey({ columns: [table.idDentista], name: "dentistas_id_dentista" }),
	]);

export const examenClinicoInicialExtraoral = mysqlTable("examen_clinico_inicial_extraoral", {
	idExtraoral: int("id_extraoral").autoincrement().notNull(),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	cabeza: text(),
	cara: text(),
	atm: text(),
	ganglios: text(),
	labios: text(),
	senalesParticulares: text("senales_particulares"),
},
	(table) => [
		index("id_paciente").on(table.idPaciente),
		primaryKey({ columns: [table.idExtraoral], name: "examen_clinico_inicial_extraoral_id_extraoral" }),
	]);

export const examenClinicoInicialIntraoral = mysqlTable("examen_clinico_inicial_intraoral", {
	idIntraoral: int("id_intraoral").autoincrement().notNull(),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	encia: text(),
	orofaringe: text(),
	lengua: text(),
	pisoBoca: text("piso_boca"),
	paladarDuro: text("paladar_duro"),
	tipoOclusion: text("tipo_oclusion"),
	paladarBlando: text("paladar_blando"),
	rebordeResidual: text("reborde_residual"),
},
	(table) => [
		index("id_paciente").on(table.idPaciente),
		primaryKey({ columns: [table.idIntraoral], name: "examen_clinico_inicial_intraoral_id_intraoral" }),
	]);

export const lotesProductos = mysqlTable("lotes_productos", {
	idLote: int("id_lote").autoincrement().notNull(),
	idProducto: int("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "restrict", onUpdate: "cascade" }),
	numeroLote: varchar("numero_lote", { length: 50 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaCaducidad: date("fecha_caducidad", { mode: 'string' }),
	cantidadInicial: int("cantidad_inicial").default(0),
},
	(table) => [
		index("idx_lotes_productos_clinica").on(table.idClinica),
		primaryKey({ columns: [table.idLote], name: "lotes_productos_id_lote" }),
	]);

export const materialesUsados = mysqlTable("materiales_usados", {
	idMaterialUsado: int("id_material_usado").autoincrement().notNull(),
	idOdontogramaProcedimiento: int("id_odontograma_procedimiento").notNull(),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente),
	idProducto: int("id_producto").notNull().references(() => productos.idProducto),
	idLote: int("id_lote").references(() => lotesProductos.idLote),
	cantidad: decimal({ precision: 10, scale: 2 }).notNull(),
	precioUnitario: decimal("precio_unitario", { precision: 10, scale: 2 }),
},
	(table) => [
		index("fk_mat_procedimiento").on(table.idOdontogramaProcedimiento),
		index("idx_mat_lote").on(table.idLote),
		primaryKey({ columns: [table.idMaterialUsado], name: "materiales_usados_id_material_usado" }),
	]);

export const movimientosInventario = mysqlTable("movimientos_inventario", {
	idMovimiento: int("id_movimiento").autoincrement().notNull(),
	idProducto: int("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "restrict", onUpdate: "cascade" }),
	idLote: int("id_lote").references(() => lotesProductos.idLote, { onDelete: "set null" }),
	tipo: mysqlEnum(['Entrada', 'Salida']).notNull(),
	cantidad: int().notNull(),
	motivo: text(),
	fechaMovimiento: timestamp("fecha_movimiento", { mode: 'string' }).defaultNow(),
},
	(table) => [
		index("idx_movimientos_clinica").on(table.idClinica),
		primaryKey({ columns: [table.idMovimiento], name: "movimientos_inventario_id_movimiento" }),
	]);

export const odontogramaDiagnosticos = mysqlTable("odontograma_diagnosticos", {
	idDiente: int("id_diente").autoincrement().notNull(),
	idOdontograma: int("id_odontograma").notNull().references(() => odontogramas.idOdontograma, { onDelete: "cascade" }),
	idCatalogoDiagnostico: int("id_catalogo_diagnostico").notNull().references(() => catalogoDiagnosticos.idDiagnostico, { onDelete: "restrict" }),
	numeroDiente: varchar("numero_diente", { length: 8 }),
	superficie: mysqlEnum(['O', 'M', 'D', 'V', 'L', 'I', 'P']),
	observaciones: text(),
	fechaActualizacion: timestamp("fecha_actualizacion", { mode: 'string' }).defaultNow().onUpdateNow(),
	otro: text(),
	tipoAfectacion: mysqlEnum("tipo_afectacion", ['CORONA', 'RAIZ', 'PIEZA_COMPLETA']).default('CORONA').notNull(),
	numeroRaiz: tinyint("numero_raiz"),
},
	(table) => [
		primaryKey({ columns: [table.idDiente], name: "odontograma_diagnosticos_id_diente" }),
	]);

export const odontogramaProcedimientos = mysqlTable("odontograma_procedimientos", {
	idOdontogramaProcedimiento: int("id_odontograma_procedimiento").autoincrement().notNull(),
	idOdontograma: int("id_odontograma").notNull().references(() => odontogramas.idOdontograma),
	idDentista: int("id_dentista").notNull().references(() => dentistas.idDentista),
	idPlan: int("id_plan").notNull().references(() => planTratamiento.idPlan),
	idPlanTratamientoProcedimiento: int("id_plan_tratamiento_procedimiento").notNull().references(() => planTratamientoProcedimientos.idProcedimiento),
	descripcion: varchar({ length: 255 }),
	fechaRealizacion: datetime("fecha_realizacion", { mode: 'string' }).default(sql`(CURRENT_TIMESTAMP)`),
	idDiagnostico: int("id_diagnostico").notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idOdontogramaProcedimiento], name: "odontograma_procedimientos_id_odontograma_procedimiento" }),
	]);

export const odontogramaVersiones = mysqlTable("odontograma_versiones", {
	idVersion: int("id_version").autoincrement().notNull(),
	idOdontograma: int("id_odontograma").notNull().references(() => odontogramas.idOdontograma, { onDelete: "cascade" }),
	numeroVersion: int("numero_version").notNull(),
	snapshot: json(),
	fechaCreacion: timestamp("fecha_creacion", { mode: 'string' }).defaultNow(),
	creadoPor: int("creado_por").references(() => usuariosLogin.idUsuario, { onDelete: "set null" }),
},
	(table) => [
		primaryKey({ columns: [table.idVersion], name: "odontograma_versiones_id_version" }),
	]);

export const odontogramas = mysqlTable("odontogramas", {
	idOdontograma: int("id_odontograma").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	version: int().default(1),
	estado: mysqlEnum(['Activo', 'Archivado']).default('Activo'),
	notaCierre: text("nota_cierre"),
	fechaCreacion: timestamp("fecha_creacion", { mode: 'string' }).defaultNow(),
},
	(table) => [
		primaryKey({ columns: [table.idOdontograma], name: "odontogramas_id_odontograma" }),
	]);

export const pacienteAtributosExtra = mysqlTable("paciente_atributos_extra", {
	idAttr: int("id_attr").autoincrement().notNull(),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	clave: varchar({ length: 100 }).notNull(),
	valor: text(),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).defaultNow(),
},
	(table) => [
		primaryKey({ columns: [table.idAttr], name: "paciente_atributos_extra_id_attr" }),
	]);

export const pacientes = mysqlTable("pacientes", {
	idPaciente: int("id_paciente").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	nombre: varchar({ length: 100 }).notNull(),
	apellidoPaterno: varchar("apellido_paterno", { length: 100 }),
	apellidoMaterno: varchar("apellido_materno", { length: 100 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaNacimiento: date("fecha_nacimiento", { mode: 'string' }),
	sexo: mysqlEnum(['M', 'F', 'Otro']).default('Otro'),
	telefono: varchar({ length: 15 }),
	correo: varchar({ length: 100 }),
	direccion: text(),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).defaultNow(),
	activo: tinyint().default(1),
	escolaridad: varchar({ length: 100 }),
	ocupacion: varchar({ length: 100 }),
	requiereTutor: tinyint("requiere_tutor").default(0),
	nombreTutor: varchar("nombre_tutor", { length: 200 }),
	telefonoTutor: varchar("telefono_tutor", { length: 15 }),
	status: mysqlEnum(['draft', 'completed']).default('draft'),
	canalAdquisicion: varchar("canal_adquisicion", { length: 100 }),
},
	(table) => [
		index("id_clinica").on(table.idClinica),
		primaryKey({ columns: [table.idPaciente], name: "pacientes_id_paciente" }),
	]);

export const pacientesLogin = mysqlTable("pacientes_login", {
	idPacienteLogin: int("id_paciente_login").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	usuario: varchar({ length: 100 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	ultimoAcceso: timestamp("ultimo_acceso", { mode: 'string' }),
	activo: tinyint().default(1),
},
	(table) => [
		primaryKey({ columns: [table.idPacienteLogin], name: "pacientes_login_id_paciente_login" }),
		unique("uq_pacientes_login").on(table.usuario, table.idClinica),
	]);

export const pagos = mysqlTable("pagos", {
	idPago: int("id_pago").autoincrement().notNull(),
	idCuota: int("id_cuota").references(() => cuotasTratamiento.idCuota, { onDelete: "set null" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica),
	idPlan: int("id_plan").references(() => planTratamiento.idPlan, { onDelete: "set null" }),
	monto: decimal({ precision: 10, scale: 2 }).notNull(),
	metodoPago: mysqlEnum("metodo_pago", ['Efectivo', 'Tarjeta', 'Transferencia']).default('Efectivo'),
	fechaPago: timestamp("fecha_pago", { mode: 'string' }).defaultNow(),
	referencia: varchar({ length: 100 }),
	nota: text(),
},
	(table) => [
		primaryKey({ columns: [table.idPago], name: "pagos_id_pago" }),
	]);

export const periodontogramaDetalles = mysqlTable("periodontograma_detalles", {
	idDetalle: int("id_detalle").autoincrement().notNull(),
	idPeriodontograma: int("id_periodontograma").notNull().references(() => periodontogramas.idPeriodontograma, { onDelete: "cascade" }),
	numeroDiente: tinyint("numero_diente").notNull(),
	cara: mysqlEnum(['V', 'L']).notNull(),
	margenM: decimal("margen_m", { precision: 4, scale: 1 }),
	margenC: decimal("margen_c", { precision: 4, scale: 1 }),
	margenD: decimal("margen_d", { precision: 4, scale: 1 }),
	sondajeM: decimal("sondaje_m", { precision: 4, scale: 1 }),
	sondajeC: decimal("sondaje_c", { precision: 4, scale: 1 }),
	sondajeD: decimal("sondaje_d", { precision: 4, scale: 1 }),
	sangradoM: tinyint("sangrado_m"),
	sangradoC: tinyint("sangrado_c"),
	sangradoD: tinyint("sangrado_d"),
	supuracionM: tinyint("supuracion_m"),
	supuracionC: tinyint("supuracion_c"),
	supuracionD: tinyint("supuracion_d"),
	placaM: tinyint("placa_m"),
	placaC: tinyint("placa_c"),
	placaD: tinyint("placa_d"),
	implante: tinyint().default(0),
	movilidad: tinyint(),
	furca: tinyint(),
	enciaQueratinizada: decimal("encia_queratinizada", { precision: 4, scale: 1 }),
},
	(table) => [
		index("idx_detalle_perio").on(table.idPeriodontograma),
		primaryKey({ columns: [table.idDetalle], name: "periodontograma_detalles_id_detalle" }),
		unique("id_periodontograma").on(table.idPeriodontograma, table.numeroDiente, table.cara),
	]);

export const periodontogramas = mysqlTable("periodontogramas", {
	idPeriodontograma: int("id_periodontograma").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	idDentista: int("id_dentista").notNull().references(() => dentistas.idDentista),
	fechaRegistro: timestamp("fecha_registro", { mode: 'string' }).defaultNow(),
	estado: mysqlEnum(['draft', 'completed']).default('draft'),
	notas: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
},
	(table) => [
		index("idx_paciente").on(table.idPaciente),
		index("idx_clinica").on(table.idClinica),
		index("idx_perio_paciente").on(table.idPaciente),
		index("idx_perio_clinica").on(table.idClinica),
		primaryKey({ columns: [table.idPeriodontograma], name: "periodontogramas_id_periodontograma" }),
	]);

export const permisos = mysqlTable("permisos", {
	idPermiso: int("id_permiso").autoincrement().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	descripcion: varchar({ length: 255 }),
},
	(table) => [
		primaryKey({ columns: [table.idPermiso], name: "permisos_id_permiso" }),
	]);

export const planTratamiento = mysqlTable("plan_tratamiento", {
	idPlan: int("id_plan").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	idDentista: int("id_dentista").notNull().references(() => dentistas.idDentista, { onDelete: "restrict" }),
	nombrePlan: varchar("nombre_plan", { length: 100 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaInicio: date("fecha_inicio", { mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	fechaFinEstimada: date("fecha_fin_estimada", { mode: 'string' }),
	costoTotalInicial: decimal("costo_total_inicial", { precision: 10, scale: 2 }).default('0.00'),
	costoAjustado: decimal("costo_ajustado", { precision: 10, scale: 2 }).default('0.00'),
	razonAjuste: text("razon_ajuste"),
	planPago: mysqlEnum("plan_pago", ['Pago unico', 'Cuotas']).default('Pago unico'),
	estado: mysqlEnum(['En Progreso', 'Completado', 'Cancelado']).default('En Progreso'),
},
	(table) => [
		index("idx_plan_paciente").on(table.idPaciente),
		primaryKey({ columns: [table.idPlan], name: "plan_tratamiento_id_plan" }),
	]);

export const planTratamientoProcedimientos = mysqlTable("plan_tratamiento_procedimientos", {
	idProcedimiento: int("id_procedimiento").autoincrement().notNull(),
	idPlan: int("id_plan").notNull().references(() => planTratamiento.idPlan, { onDelete: "cascade" }),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	idCatalogoProcedimiento: int("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "restrict" }),
	status: mysqlEnum(['Pendiente', 'Realizado']).default('Pendiente'),
	cantidad: int().default(1),
	precioUnitario: decimal("precio_unitario", { precision: 10, scale: 2 }),
},
	(table) => [
		primaryKey({ columns: [table.idProcedimiento], name: "plan_tratamiento_procedimientos_id_procedimiento" }),
	]);

export const preciosProcedimientos = mysqlTable("precios_procedimientos", {
	idPrecio: int("id_precio").autoincrement().notNull(),
	idCatalogoProcedimiento: int("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "cascade" }),
	precio: decimal({ precision: 10, scale: 2 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idPrecio], name: "precios_procedimientos_id_precio" }),
		unique("id_catalogo_procedimiento").on(table.idCatalogoProcedimiento),
	]);

export const productos = mysqlTable("productos", {
	idProducto: int("id_producto").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	nombre: varchar({ length: 150 }).notNull(),
	descripcion: text(),
	unidadMedida: varchar("unidad_medida", { length: 50 }),
	costoUnitario: decimal("costo_unitario", { precision: 10, scale: 2 }).default('0.00'),
	activo: tinyint().default(1),
},
	(table) => [
		index("idx_prod_clinica").on(table.idClinica),
		primaryKey({ columns: [table.idProducto], name: "productos_id_producto" }),
	]);

export const recibos = mysqlTable("recibos", {
	idRecibo: int("id_recibo").autoincrement().notNull(),
	idPago: int("id_pago").notNull().references(() => pagos.idPago, { onDelete: "cascade" }),
	idPaciente: int("id_paciente").notNull().references(() => pacientes.idPaciente, { onDelete: "cascade" }),
	numeroRecibo: varchar("numero_recibo", { length: 100 }),
	fechaEmision: timestamp("fecha_emision", { mode: 'string' }).defaultNow(),
	tipoComprobante: mysqlEnum("tipo_comprobante", ['Recibo', 'Comprobante']).default('Recibo'),
	total: decimal({ precision: 10, scale: 2 }).notNull(),
	archivoUrl: varchar("archivo_url", { length: 255 }),
	generadoPor: varchar("generado_por", { length: 100 }),
	notas: text(),
},
	(table) => [
		primaryKey({ columns: [table.idRecibo], name: "recibos_id_recibo" }),
	]);

export const rolPermiso = mysqlTable("rol_permiso", {
	idRol: int("id_rol").notNull().references(() => roles.idRol, { onDelete: "cascade" }),
	idPermiso: int("id_permiso").notNull().references(() => permisos.idPermiso, { onDelete: "cascade" }),
},
	(table) => [
		primaryKey({ columns: [table.idRol, table.idPermiso], name: "rol_permiso_id_rol_id_permiso" }),
	]);

export const roles = mysqlTable("roles", {
	idRol: int("id_rol").autoincrement().notNull(),
	idClinica: int("id_clinica").references(() => clinicas.idClinica, { onDelete: "cascade" }),
	nombreRol: varchar("nombre_rol", { length: 50 }).notNull(),
	descripcion: varchar({ length: 255 }),
	esBase: tinyint("es_base").default(0),
},
	(table) => [
		primaryKey({ columns: [table.idRol], name: "roles_id_rol" }),
	]);

export const stockActual = mysqlTable("stock_actual", {
	idStock: int("id_stock").autoincrement().notNull(),
	idProducto: int("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
	idClinica: int("id_clinica").notNull(),
	idLote: int("id_lote").references(() => lotesProductos.idLote, { onDelete: "set null" }),
	stockDisponible: int("stock_disponible").default(0),
	ultimaActualizacion: timestamp("ultima_actualizacion", { mode: 'string' }).defaultNow().onUpdateNow(),
},
	(table) => [
		primaryKey({ columns: [table.idStock], name: "stock_actual_id_stock" }),
		unique("id_producto").on(table.idProducto, table.idLote),
		unique("uniq_stock").on(table.idProducto, table.idLote, table.idClinica),
	]);

export const tipoAntecedente = mysqlTable("tipo_antecedente", {
	idTipo: int("id_tipo").autoincrement().notNull(),
	nombre: varchar({ length: 100 }).notNull(),
	tipo: mysqlEnum(['patologico', 'no_patologico']).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idTipo], name: "tipo_antecedente_id_tipo" }),
	]);

export const usuariosLogin = mysqlTable("usuarios_login", {
	idUsuario: int("id_usuario").autoincrement().notNull(),
	idClinica: int("id_clinica").notNull().references(() => clinicas.idClinica, { onDelete: "cascade" }),
	idDentista: int("id_dentista").references(() => dentistas.idDentista, { onDelete: "set null" }),
	usuario: varchar({ length: 100 }).notNull(),
	passwordHash: varchar("password_hash", { length: 255 }).notNull(),
	idRol: int("id_rol").notNull().references(() => roles.idRol, { onDelete: "restrict" }),
	ultimoAcceso: timestamp("ultimo_acceso", { mode: 'string' }),
	activo: tinyint().default(1),
},
	(table) => [
		primaryKey({ columns: [table.idUsuario], name: "usuarios_login_id_usuario" }),
		unique("uq_usuarios_login").on(table.usuario, table.idClinica),
	]);

export const insumosProcedimiento = mysqlTable("insumos_procedimiento", {
	idInsumo: int("id_insumo").autoincrement().notNull(),
	idCatalogoProcedimiento: int("id_catalogo_procedimiento").notNull().references(() => catalogoProcedimientos.idCatalogoProcedimiento, { onDelete: "cascade" }),
	idProducto: int("id_producto").notNull().references(() => productos.idProducto, { onDelete: "cascade" }),
	cantidad: decimal({ precision: 10, scale: 2 }).default('1.00').notNull(),
},
	(table) => [
		primaryKey({ columns: [table.idInsumo], name: "insumos_procedimiento_id_insumo" }),
	]);
