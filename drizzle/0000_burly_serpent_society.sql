-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `admins_saas` (
	`id_admin` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`usuario` varchar(150) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`id_rol` int NOT NULL,
	`ultimo_acceso` timestamp,
	`activo` tinyint(1) DEFAULT 1,
	CONSTRAINT `admins_saas_id_admin` PRIMARY KEY(`id_admin`),
	CONSTRAINT `uq_admin_email` UNIQUE(`usuario`),
	CONSTRAINT `usuario` UNIQUE(`usuario`)
);
--> statement-breakpoint
CREATE TABLE `antecedentes` (
	`id_antecedente` int AUTO_INCREMENT NOT NULL,
	`id_paciente` int NOT NULL,
	`id_tipo_antecedente` int NOT NULL,
	`fecha_registro` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `antecedentes_id_antecedente` PRIMARY KEY(`id_antecedente`)
);
--> statement-breakpoint
CREATE TABLE `archivos_clinicas` (
	`id_archivo` int AUTO_INCREMENT NOT NULL,
	`id_consulta` int,
	`id_paciente` int NOT NULL,
	`tipo` enum('Intraoral','Extraoral','Panoramica','Periapical','Documento_Medico','Consentimiento_Informado','Otro') DEFAULT 'Otro',
	`nombre_archivo` varchar(100),
	`descripcion` text,
	`fecha_subida` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`ruta_archivo` varchar(255),
	CONSTRAINT `archivos_clinicas_id_archivo` PRIMARY KEY(`id_archivo`)
);
--> statement-breakpoint
CREATE TABLE `auditoria` (
	`id_audit` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int,
	`entidad` varchar(100),
	`id_entidad` int,
	`accion` varchar(50),
	`usuario` varchar(150),
	`detalle` json,
	`ip_origen` varchar(45),
	`user_agent` varchar(255),
	`fecha` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `auditoria_id_audit` PRIMARY KEY(`id_audit`)
);
--> statement-breakpoint
CREATE TABLE `bloques_disponibilidad` (
	`id_bloque` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`dia_semana` enum('Lun','Mar','Mie','Jue','Vie','Sab','Dom') NOT NULL,
	`hora_inicio` time NOT NULL,
	`hora_fin` time NOT NULL,
	`activo` tinyint(1) DEFAULT 1,
	CONSTRAINT `bloques_disponibilidad_id_bloque` PRIMARY KEY(`id_bloque`)
);
--> statement-breakpoint
CREATE TABLE `catalogo_diagnosticos` (
	`id_diagnostico` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	`tipo` enum('Diente','Superficie') NOT NULL,
	`color_icon` varchar(10),
	`simbolo` varchar(20),
	CONSTRAINT `catalogo_diagnosticos_id_diagnostico` PRIMARY KEY(`id_diagnostico`)
);
--> statement-breakpoint
CREATE TABLE `catalogo_procedimientos` (
	`id_catalogo_procedimiento` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`descripcion` text,
	`activo` tinyint(1) DEFAULT 1,
	`color` varchar(7) NOT NULL DEFAULT '#00676E',
	CONSTRAINT `catalogo_procedimientos_id_catalogo_procedimiento` PRIMARY KEY(`id_catalogo_procedimiento`)
);
--> statement-breakpoint
CREATE TABLE `citas` (
	`id_cita` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`id_dentista` int NOT NULL,
	`fecha_cita` date NOT NULL,
	`hora_inicio` time NOT NULL,
	`hora_fin` time NOT NULL,
	`estado` enum('Pendiente','Confirmada','Cancelada','Completada') NOT NULL,
	`id_procedimiento` int,
	`notas` text,
	`creado_por` enum('Paciente','Recepcionista','Dentista') NOT NULL,
	CONSTRAINT `citas_id_cita` PRIMARY KEY(`id_cita`),
	CONSTRAINT `unica_cita` UNIQUE(`id_dentista`,`fecha_cita`,`hora_inicio`)
);
--> statement-breakpoint
CREATE TABLE `clinicas` (
	`id_clinica` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`subdominio` varchar(100),
	`logo_url` varchar(255),
	`color_principal` varchar(7),
	`direccion` text,
	`telefono` varchar(15),
	`correo_contacto` varchar(100),
	`plan_saas` enum('Básico','Pro','Premium') DEFAULT 'Básico',
	`limite_pacientes` int,
	`fecha_registro` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`activo` tinyint(1) DEFAULT 1,
	`color_secundario` varchar(7) NOT NULL DEFAULT '#D8F0F2',
	`color_extra` varchar(7) NOT NULL DEFAULT '#ff7701',
	CONSTRAINT `clinicas_id_clinica` PRIMARY KEY(`id_clinica`),
	CONSTRAINT `subdominio` UNIQUE(`subdominio`)
);
--> statement-breakpoint
CREATE TABLE `configuracion_clinica` (
	`id_config` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_dentista` int,
	`tiempo_anticipacion_cancelacion` int,
	`max_citas_dia` int DEFAULT 0,
	`permite_agendamiento_online` tinyint(1) DEFAULT 1,
	`tolerancia_llegada_minutos` int DEFAULT 0,
	`permitir_reserva_superpuesta` tinyint(1) DEFAULT 0,
	`zona_horaria` varchar(50),
	`fecha_actualizacion` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`requiere_anticipo` tinyint(1) DEFAULT 0,
	`duracion_bloque` int DEFAULT 60,
	`tiempo_entre_citas` int DEFAULT 10,
	`numeracion_odontograma` enum('FDI','Universal') DEFAULT 'FDI',
	`dias_laborales` json,
	`hora_inicio_clinica` time,
	`hora_fin_clinica` time,
	CONSTRAINT `configuracion_clinica_id_config` PRIMARY KEY(`id_config`)
);
--> statement-breakpoint
CREATE TABLE `consultas` (
	`id_consulta` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`id_dentista` int NOT NULL,
	`motivo_consulta` text,
	`examen_extraoral` text,
	`examen_intraoral` text,
	`fecha_consulta` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`proxima_cita` date,
	`notas` text,
	CONSTRAINT `consultas_id_consulta` PRIMARY KEY(`id_consulta`)
);
--> statement-breakpoint
CREATE TABLE `cuotas_tratamiento` (
	`id_cuota` int AUTO_INCREMENT NOT NULL,
	`id_plan` int NOT NULL,
	`id_paciente` int NOT NULL,
	`monto` decimal(10,2) NOT NULL,
	`fecha_programada` date NOT NULL,
	`pagada` tinyint(1) DEFAULT 0,
	CONSTRAINT `cuotas_tratamiento_id_cuota` PRIMARY KEY(`id_cuota`)
);
--> statement-breakpoint
CREATE TABLE `datos_facturacion` (
	`id_dato_facturacion` int AUTO_INCREMENT NOT NULL,
	`id_paciente` int NOT NULL,
	`rfc` varchar(20),
	`razon_social` varchar(150),
	`direccion_fiscal` text,
	CONSTRAINT `datos_facturacion_id_dato_facturacion` PRIMARY KEY(`id_dato_facturacion`)
);
--> statement-breakpoint
CREATE TABLE `dentistas` (
	`id_dentista` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`apellido_paterno` varchar(100),
	`apellido_materno` varchar(100),
	`telefono` varchar(15),
	`correo` varchar(100),
	`especialidad` varchar(100),
	`activo` tinyint(1) DEFAULT 1,
	`fecha_registro` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `dentistas_id_dentista` PRIMARY KEY(`id_dentista`)
);
--> statement-breakpoint
CREATE TABLE `examen_clinico_inicial_extraoral` (
	`id_extraoral` int AUTO_INCREMENT NOT NULL,
	`id_paciente` int NOT NULL,
	`cabeza` text,
	`cara` text,
	`atm` text,
	`ganglios` text,
	`labios` text,
	`senales_particulares` text,
	CONSTRAINT `examen_clinico_inicial_extraoral_id_extraoral` PRIMARY KEY(`id_extraoral`)
);
--> statement-breakpoint
CREATE TABLE `examen_clinico_inicial_intraoral` (
	`id_intraoral` int AUTO_INCREMENT NOT NULL,
	`id_paciente` int NOT NULL,
	`encia` text,
	`orofaringe` text,
	`lengua` text,
	`piso_boca` text,
	`paladar_duro` text,
	`tipo_oclusion` text,
	`paladar_blando` text,
	`reborde_residual` text,
	CONSTRAINT `examen_clinico_inicial_intraoral_id_intraoral` PRIMARY KEY(`id_intraoral`)
);
--> statement-breakpoint
CREATE TABLE `lotes_productos` (
	`id_lote` int AUTO_INCREMENT NOT NULL,
	`id_producto` int NOT NULL,
	`id_clinica` int NOT NULL,
	`numero_lote` varchar(50),
	`fecha_caducidad` date,
	`cantidad_inicial` int DEFAULT 0,
	CONSTRAINT `lotes_productos_id_lote` PRIMARY KEY(`id_lote`)
);
--> statement-breakpoint
CREATE TABLE `materiales_usados` (
	`id_material_usado` int AUTO_INCREMENT NOT NULL,
	`id_odontograma_procedimiento` int NOT NULL,
	`id_paciente` int NOT NULL,
	`id_producto` int NOT NULL,
	`id_lote` int,
	`cantidad` decimal(10,2) NOT NULL,
	`precio_unitario` decimal(10,2),
	CONSTRAINT `materiales_usados_id_material_usado` PRIMARY KEY(`id_material_usado`)
);
--> statement-breakpoint
CREATE TABLE `movimientos_inventario` (
	`id_movimiento` int AUTO_INCREMENT NOT NULL,
	`id_producto` int NOT NULL,
	`id_clinica` int NOT NULL,
	`id_lote` int,
	`tipo` enum('Entrada','Salida') NOT NULL,
	`cantidad` int NOT NULL,
	`motivo` text,
	`fecha_movimiento` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `movimientos_inventario_id_movimiento` PRIMARY KEY(`id_movimiento`)
);
--> statement-breakpoint
CREATE TABLE `odontograma_diagnosticos` (
	`id_diente` int AUTO_INCREMENT NOT NULL,
	`id_odontograma` int NOT NULL,
	`id_catalogo_diagnostico` int NOT NULL,
	`numero_diente` varchar(8),
	`superficie` enum('O','M','D','V','L','I','P'),
	`observaciones` text,
	`fecha_actualizacion` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	`otro` text,
	`tipo_afectacion` enum('CORONA','RAIZ','PIEZA_COMPLETA') NOT NULL DEFAULT 'CORONA',
	`numero_raiz` tinyint,
	CONSTRAINT `odontograma_diagnosticos_id_diente` PRIMARY KEY(`id_diente`)
);
--> statement-breakpoint
CREATE TABLE `odontograma_procedimientos` (
	`id_odontograma_procedimiento` int AUTO_INCREMENT NOT NULL,
	`id_odontograma` int NOT NULL,
	`id_dentista` int NOT NULL,
	`id_plan` int NOT NULL,
	`id_plan_tratamiento_procedimiento` int NOT NULL,
	`descripcion` varchar(255),
	`fecha_realizacion` datetime DEFAULT (CURRENT_TIMESTAMP),
	`id_diagnostico` int NOT NULL,
	CONSTRAINT `odontograma_procedimientos_id_odontograma_procedimiento` PRIMARY KEY(`id_odontograma_procedimiento`)
);
--> statement-breakpoint
CREATE TABLE `odontograma_versiones` (
	`id_version` int AUTO_INCREMENT NOT NULL,
	`id_odontograma` int NOT NULL,
	`numero_version` int NOT NULL,
	`snapshot` json,
	`fecha_creacion` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`creado_por` int,
	CONSTRAINT `odontograma_versiones_id_version` PRIMARY KEY(`id_version`)
);
--> statement-breakpoint
CREATE TABLE `odontogramas` (
	`id_odontograma` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`version` int DEFAULT 1,
	`estado` enum('Activo','Archivado') DEFAULT 'Activo',
	`nota_cierre` text,
	`fecha_creacion` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `odontogramas_id_odontograma` PRIMARY KEY(`id_odontograma`)
);
--> statement-breakpoint
CREATE TABLE `paciente_atributos_extra` (
	`id_attr` int AUTO_INCREMENT NOT NULL,
	`id_paciente` int NOT NULL,
	`clave` varchar(100) NOT NULL,
	`valor` text,
	`fecha_registro` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `paciente_atributos_extra_id_attr` PRIMARY KEY(`id_attr`)
);
--> statement-breakpoint
CREATE TABLE `pacientes` (
	`id_paciente` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`apellido_paterno` varchar(100),
	`apellido_materno` varchar(100),
	`fecha_nacimiento` date,
	`sexo` enum('M','F','Otro') DEFAULT 'Otro',
	`telefono` varchar(15),
	`correo` varchar(100),
	`direccion` text,
	`fecha_registro` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`activo` tinyint(1) DEFAULT 1,
	`escolaridad` varchar(100),
	`ocupacion` varchar(100),
	`requiere_tutor` tinyint(1) DEFAULT 0,
	`nombre_tutor` varchar(200),
	`telefono_tutor` varchar(15),
	`status` enum('draft','completed') DEFAULT 'draft',
	CONSTRAINT `pacientes_id_paciente` PRIMARY KEY(`id_paciente`)
);
--> statement-breakpoint
CREATE TABLE `pacientes_login` (
	`id_paciente_login` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`usuario` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`ultimo_acceso` timestamp,
	`activo` tinyint(1) DEFAULT 1,
	CONSTRAINT `pacientes_login_id_paciente_login` PRIMARY KEY(`id_paciente_login`),
	CONSTRAINT `uq_pacientes_login` UNIQUE(`usuario`,`id_clinica`)
);
--> statement-breakpoint
CREATE TABLE `pagos` (
	`id_pago` int AUTO_INCREMENT NOT NULL,
	`id_cuota` int,
	`id_paciente` int NOT NULL,
	`id_clinica` int NOT NULL,
	`id_plan` int,
	`monto` decimal(10,2) NOT NULL,
	`metodo_pago` enum('Efectivo','Tarjeta','Transferencia') DEFAULT 'Efectivo',
	`fecha_pago` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`referencia` varchar(100),
	`nota` text,
	CONSTRAINT `pagos_id_pago` PRIMARY KEY(`id_pago`)
);
--> statement-breakpoint
CREATE TABLE `periodontograma_detalles` (
	`id_detalle` int AUTO_INCREMENT NOT NULL,
	`id_periodontograma` int NOT NULL,
	`numero_diente` tinyint NOT NULL,
	`cara` enum('V','L') NOT NULL,
	`margen_m` decimal(4,1),
	`margen_c` decimal(4,1),
	`margen_d` decimal(4,1),
	`sondaje_m` decimal(4,1),
	`sondaje_c` decimal(4,1),
	`sondaje_d` decimal(4,1),
	`sangrado_m` tinyint(1),
	`sangrado_c` tinyint(1),
	`sangrado_d` tinyint(1),
	`supuracion_m` tinyint(1),
	`supuracion_c` tinyint(1),
	`supuracion_d` tinyint(1),
	`placa_m` tinyint(1),
	`placa_c` tinyint(1),
	`placa_d` tinyint(1),
	`implante` tinyint(1) DEFAULT 0,
	`movilidad` tinyint,
	`furca` tinyint,
	`encia_queratinizada` decimal(4,1),
	CONSTRAINT `periodontograma_detalles_id_detalle` PRIMARY KEY(`id_detalle`),
	CONSTRAINT `id_periodontograma` UNIQUE(`id_periodontograma`,`numero_diente`,`cara`)
);
--> statement-breakpoint
CREATE TABLE `periodontogramas` (
	`id_periodontograma` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`id_dentista` int NOT NULL,
	`fecha_registro` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`estado` enum('draft','completed') DEFAULT 'draft',
	`notas` text,
	`created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` timestamp,
	CONSTRAINT `periodontogramas_id_periodontograma` PRIMARY KEY(`id_periodontograma`)
);
--> statement-breakpoint
CREATE TABLE `permisos` (
	`id_permiso` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`descripcion` varchar(255),
	CONSTRAINT `permisos_id_permiso` PRIMARY KEY(`id_permiso`)
);
--> statement-breakpoint
CREATE TABLE `plan_tratamiento` (
	`id_plan` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`id_dentista` int NOT NULL,
	`nombre_plan` varchar(100),
	`fecha_inicio` date,
	`fecha_fin_estimada` date,
	`costo_total_inicial` decimal(10,2) DEFAULT '0.00',
	`costo_ajustado` decimal(10,2) DEFAULT '0.00',
	`razon_ajuste` text,
	`plan_pago` enum('Pago unico','Cuotas') DEFAULT 'Pago unico',
	`estado` enum('En Progreso','Completado','Cancelado') DEFAULT 'En Progreso',
	CONSTRAINT `plan_tratamiento_id_plan` PRIMARY KEY(`id_plan`)
);
--> statement-breakpoint
CREATE TABLE `plan_tratamiento_procedimientos` (
	`id_procedimiento` int AUTO_INCREMENT NOT NULL,
	`id_plan` int NOT NULL,
	`id_clinica` int NOT NULL,
	`id_paciente` int NOT NULL,
	`id_catalogo_procedimiento` int NOT NULL,
	`status` enum('Pendiente','Realizado') DEFAULT 'Pendiente',
	`cantidad` int DEFAULT 1,
	`precio_unitario` decimal(10,2),
	CONSTRAINT `plan_tratamiento_procedimientos_id_procedimiento` PRIMARY KEY(`id_procedimiento`)
);
--> statement-breakpoint
CREATE TABLE `precios_procedimientos` (
	`id_precio` int AUTO_INCREMENT NOT NULL,
	`id_catalogo_procedimiento` int NOT NULL,
	`precio` decimal(10,2) NOT NULL,
	CONSTRAINT `precios_procedimientos_id_precio` PRIMARY KEY(`id_precio`),
	CONSTRAINT `id_catalogo_procedimiento` UNIQUE(`id_catalogo_procedimiento`)
);
--> statement-breakpoint
CREATE TABLE `productos` (
	`id_producto` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`nombre` varchar(150) NOT NULL,
	`descripcion` text,
	`unidad_medida` varchar(50),
	`costo_unitario` decimal(10,2) DEFAULT '0.00',
	`activo` tinyint(1) DEFAULT 1,
	CONSTRAINT `productos_id_producto` PRIMARY KEY(`id_producto`)
);
--> statement-breakpoint
CREATE TABLE `recibos` (
	`id_recibo` int AUTO_INCREMENT NOT NULL,
	`id_pago` int NOT NULL,
	`id_paciente` int NOT NULL,
	`numero_recibo` varchar(100),
	`fecha_emision` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`tipo_comprobante` enum('Recibo','Comprobante') DEFAULT 'Recibo',
	`total` decimal(10,2) NOT NULL,
	`archivo_url` varchar(255),
	`generado_por` varchar(100),
	`notas` text,
	CONSTRAINT `recibos_id_recibo` PRIMARY KEY(`id_recibo`)
);
--> statement-breakpoint
CREATE TABLE `rol_permiso` (
	`id_rol` int NOT NULL,
	`id_permiso` int NOT NULL,
	CONSTRAINT `rol_permiso_id_rol_id_permiso` PRIMARY KEY(`id_rol`,`id_permiso`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id_rol` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int,
	`nombre_rol` varchar(50) NOT NULL,
	`descripcion` varchar(255),
	`es_base` tinyint(1) DEFAULT 0,
	CONSTRAINT `roles_id_rol` PRIMARY KEY(`id_rol`)
);
--> statement-breakpoint
CREATE TABLE `stock_actual` (
	`id_stock` int AUTO_INCREMENT NOT NULL,
	`id_producto` int NOT NULL,
	`id_clinica` int NOT NULL,
	`id_lote` int,
	`stock_disponible` int DEFAULT 0,
	`ultima_actualizacion` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stock_actual_id_stock` PRIMARY KEY(`id_stock`),
	CONSTRAINT `id_producto` UNIQUE(`id_producto`,`id_lote`),
	CONSTRAINT `uniq_stock` UNIQUE(`id_producto`,`id_lote`,`id_clinica`)
);
--> statement-breakpoint
CREATE TABLE `tipo_antecedente` (
	`id_tipo` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(100) NOT NULL,
	`tipo` enum('patologico','no_patologico') NOT NULL,
	CONSTRAINT `tipo_antecedente_id_tipo` PRIMARY KEY(`id_tipo`)
);
--> statement-breakpoint
CREATE TABLE `usuarios_login` (
	`id_usuario` int AUTO_INCREMENT NOT NULL,
	`id_clinica` int NOT NULL,
	`id_dentista` int,
	`usuario` varchar(100) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`id_rol` int NOT NULL,
	`ultimo_acceso` timestamp,
	`activo` tinyint(1) DEFAULT 1,
	CONSTRAINT `usuarios_login_id_usuario` PRIMARY KEY(`id_usuario`),
	CONSTRAINT `uq_usuarios_login` UNIQUE(`usuario`,`id_clinica`)
);
--> statement-breakpoint
ALTER TABLE `admins_saas` ADD CONSTRAINT `fk_admin_idrol` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `antecedentes` ADD CONSTRAINT `fk_antecedentes_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `antecedentes` ADD CONSTRAINT `fk_antecedentes_tipo` FOREIGN KEY (`id_tipo_antecedente`) REFERENCES `tipo_antecedente`(`id_tipo`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `archivos_clinicas` ADD CONSTRAINT `fk_archivos_consulta` FOREIGN KEY (`id_consulta`) REFERENCES `consultas`(`id_consulta`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `archivos_clinicas` ADD CONSTRAINT `fk_archivos_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `auditoria` ADD CONSTRAINT `fk_audit_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bloques_disponibilidad` ADD CONSTRAINT `fk_bloques_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `catalogo_procedimientos` ADD CONSTRAINT `fk_catalogo_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `citas` ADD CONSTRAINT `fk_citas_clinicas` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `citas` ADD CONSTRAINT `fk_citas_dentistas` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `citas` ADD CONSTRAINT `fk_citas_pacientes` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `citas` ADD CONSTRAINT `fk_citas_procedimientos` FOREIGN KEY (`id_procedimiento`) REFERENCES `catalogo_procedimientos`(`id_catalogo_procedimiento`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `configuracion_clinica` ADD CONSTRAINT `fk_config_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `configuracion_clinica` ADD CONSTRAINT `fk_config_dentista` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consultas` ADD CONSTRAINT `fk_consultas_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consultas` ADD CONSTRAINT `fk_consultas_dentista` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `consultas` ADD CONSTRAINT `fk_consultas_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cuotas_tratamiento` ADD CONSTRAINT `fk_cuotas_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `cuotas_tratamiento` ADD CONSTRAINT `fk_cuotas_plan` FOREIGN KEY (`id_plan`) REFERENCES `plan_tratamiento`(`id_plan`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `datos_facturacion` ADD CONSTRAINT `fk_facturacion_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dentistas` ADD CONSTRAINT `fk_dentistas_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `examen_clinico_inicial_extraoral` ADD CONSTRAINT `examen_clinico_inicial_extraoral_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `examen_clinico_inicial_intraoral` ADD CONSTRAINT `examen_clinico_inicial_intraoral_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lotes_productos` ADD CONSTRAINT `fk_lotes_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lotes_productos` ADD CONSTRAINT `fk_lotes_productos_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `materiales_usados` ADD CONSTRAINT `fk_mat_lote` FOREIGN KEY (`id_lote`) REFERENCES `lotes_productos`(`id_lote`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materiales_usados` ADD CONSTRAINT `fk_mat_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materiales_usados` ADD CONSTRAINT `fk_mat_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `movimientos_inventario` ADD CONSTRAINT `fk_movimientos_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `movimientos_inventario` ADD CONSTRAINT `fk_mov_lote` FOREIGN KEY (`id_lote`) REFERENCES `lotes_productos`(`id_lote`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `movimientos_inventario` ADD CONSTRAINT `fk_mov_prod` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_diagnosticos` ADD CONSTRAINT `fk_odontdiag_catalogo` FOREIGN KEY (`id_catalogo_diagnostico`) REFERENCES `catalogo_diagnosticos`(`id_diagnostico`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_diagnosticos` ADD CONSTRAINT `fk_odontdiag_odontograma` FOREIGN KEY (`id_odontograma`) REFERENCES `odontogramas`(`id_odontograma`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_procedimientos` ADD CONSTRAINT `fk_op_dentista` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_procedimientos` ADD CONSTRAINT `fk_op_odontograma` FOREIGN KEY (`id_odontograma`) REFERENCES `odontogramas`(`id_odontograma`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_procedimientos` ADD CONSTRAINT `fk_op_plan` FOREIGN KEY (`id_plan`) REFERENCES `plan_tratamiento`(`id_plan`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_procedimientos` ADD CONSTRAINT `fk_op_plan_proc` FOREIGN KEY (`id_plan_tratamiento_procedimiento`) REFERENCES `plan_tratamiento_procedimientos`(`id_procedimiento`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_versiones` ADD CONSTRAINT `fk_odover_odontograma` FOREIGN KEY (`id_odontograma`) REFERENCES `odontogramas`(`id_odontograma`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontograma_versiones` ADD CONSTRAINT `fk_odover_usuario` FOREIGN KEY (`creado_por`) REFERENCES `usuarios_login`(`id_usuario`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontogramas` ADD CONSTRAINT `fk_odontograma_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `odontogramas` ADD CONSTRAINT `fk_odontograma_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paciente_atributos_extra` ADD CONSTRAINT `fk_attr_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pacientes` ADD CONSTRAINT `fk_pacientes_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pacientes_login` ADD CONSTRAINT `fk_pacienteslogin_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pacientes_login` ADD CONSTRAINT `fk_pacienteslogin_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `fk_pagos_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `fk_pagos_cuota` FOREIGN KEY (`id_cuota`) REFERENCES `cuotas_tratamiento`(`id_cuota`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `fk_pagos_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pagos` ADD CONSTRAINT `fk_pagos_plan` FOREIGN KEY (`id_plan`) REFERENCES `plan_tratamiento`(`id_plan`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `periodontograma_detalles` ADD CONSTRAINT `fk_detalle_perio` FOREIGN KEY (`id_periodontograma`) REFERENCES `periodontogramas`(`id_periodontograma`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `periodontogramas` ADD CONSTRAINT `fk_perio_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `periodontogramas` ADD CONSTRAINT `fk_perio_dentista` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `periodontogramas` ADD CONSTRAINT `fk_perio_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento` ADD CONSTRAINT `fk_plan_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento` ADD CONSTRAINT `fk_plan_dentista` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento` ADD CONSTRAINT `fk_plan_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento_procedimientos` ADD CONSTRAINT `fk_ptp_catalogo` FOREIGN KEY (`id_catalogo_procedimiento`) REFERENCES `catalogo_procedimientos`(`id_catalogo_procedimiento`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento_procedimientos` ADD CONSTRAINT `fk_ptp_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento_procedimientos` ADD CONSTRAINT `fk_ptp_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `plan_tratamiento_procedimientos` ADD CONSTRAINT `fk_ptp_plan` FOREIGN KEY (`id_plan`) REFERENCES `plan_tratamiento`(`id_plan`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `precios_procedimientos` ADD CONSTRAINT `fk_precio_catalogo` FOREIGN KEY (`id_catalogo_procedimiento`) REFERENCES `catalogo_procedimientos`(`id_catalogo_procedimiento`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `productos` ADD CONSTRAINT `fk_productos_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recibos` ADD CONSTRAINT `fk_recibos_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes`(`id_paciente`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `recibos` ADD CONSTRAINT `fk_recibos_pago` FOREIGN KEY (`id_pago`) REFERENCES `pagos`(`id_pago`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rol_permiso` ADD CONSTRAINT `fk_rolperm_permiso` FOREIGN KEY (`id_permiso`) REFERENCES `permisos`(`id_permiso`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rol_permiso` ADD CONSTRAINT `fk_rolperm_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `fk_roles_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_actual` ADD CONSTRAINT `fk_stock_lote` FOREIGN KEY (`id_lote`) REFERENCES `lotes_productos`(`id_lote`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `stock_actual` ADD CONSTRAINT `fk_stock_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id_producto`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuarios_login` ADD CONSTRAINT `fk_usuarios_clinica` FOREIGN KEY (`id_clinica`) REFERENCES `clinicas`(`id_clinica`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuarios_login` ADD CONSTRAINT `fk_usuarios_dentista` FOREIGN KEY (`id_dentista`) REFERENCES `dentistas`(`id_dentista`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usuarios_login` ADD CONSTRAINT `fk_usuarios_idrol` FOREIGN KEY (`id_rol`) REFERENCES `roles`(`id_rol`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_citas_paciente` ON `consultas` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `idx_cuotas_paciente` ON `cuotas_tratamiento` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `id_paciente` ON `examen_clinico_inicial_extraoral` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `id_paciente` ON `examen_clinico_inicial_intraoral` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `idx_lotes_productos_clinica` ON `lotes_productos` (`id_clinica`);--> statement-breakpoint
CREATE INDEX `fk_mat_procedimiento` ON `materiales_usados` (`id_odontograma_procedimiento`);--> statement-breakpoint
CREATE INDEX `idx_mat_lote` ON `materiales_usados` (`id_lote`);--> statement-breakpoint
CREATE INDEX `idx_movimientos_clinica` ON `movimientos_inventario` (`id_clinica`);--> statement-breakpoint
CREATE INDEX `id_clinica` ON `pacientes` (`id_clinica`);--> statement-breakpoint
CREATE INDEX `idx_detalle_perio` ON `periodontograma_detalles` (`id_periodontograma`);--> statement-breakpoint
CREATE INDEX `idx_paciente` ON `periodontogramas` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `idx_clinica` ON `periodontogramas` (`id_clinica`);--> statement-breakpoint
CREATE INDEX `idx_perio_paciente` ON `periodontogramas` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `idx_perio_clinica` ON `periodontogramas` (`id_clinica`);--> statement-breakpoint
CREATE INDEX `idx_plan_paciente` ON `plan_tratamiento` (`id_paciente`);--> statement-breakpoint
CREATE INDEX `idx_prod_clinica` ON `productos` (`id_clinica`);
*/