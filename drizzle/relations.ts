import { relations } from "drizzle-orm/relations";
import { roles, adminsSaas, pacientes, antecedentes, tipoAntecedente, consultas, archivosClinicas, clinicas, auditoria, bloquesDisponibilidad, catalogoProcedimientos, citas, dentistas, configuracionClinica, cuotasTratamiento, planTratamiento, datosFacturacion, examenClinicoInicialExtraoral, examenClinicoInicialIntraoral, productos, lotesProductos, materialesUsados, movimientosInventario, catalogoDiagnosticos, odontogramaDiagnosticos, odontogramas, odontogramaProcedimientos, planTratamientoProcedimientos, odontogramaVersiones, usuariosLogin, pacienteAtributosExtra, pacientesLogin, pagos, periodontogramas, periodontogramaDetalles, preciosProcedimientos, recibos, permisos, rolPermiso, stockActual } from "./schema";

export const adminsSaasRelations = relations(adminsSaas, ({one}) => ({
	role: one(roles, {
		fields: [adminsSaas.idRol],
		references: [roles.idRol]
	}),
}));

export const rolesRelations = relations(roles, ({one, many}) => ({
	adminsSaas: many(adminsSaas),
	rolPermisos: many(rolPermiso),
	clinica: one(clinicas, {
		fields: [roles.idClinica],
		references: [clinicas.idClinica]
	}),
	usuariosLogins: many(usuariosLogin),
}));

export const antecedentesRelations = relations(antecedentes, ({one}) => ({
	paciente: one(pacientes, {
		fields: [antecedentes.idPaciente],
		references: [pacientes.idPaciente]
	}),
	tipoAntecedente: one(tipoAntecedente, {
		fields: [antecedentes.idTipoAntecedente],
		references: [tipoAntecedente.idTipo]
	}),
}));

export const pacientesRelations = relations(pacientes, ({one, many}) => ({
	antecedentes: many(antecedentes),
	archivosClinicas: many(archivosClinicas),
	citas: many(citas),
	consultas: many(consultas),
	cuotasTratamientos: many(cuotasTratamiento),
	datosFacturacions: many(datosFacturacion),
	examenClinicoInicialExtraorals: many(examenClinicoInicialExtraoral),
	examenClinicoInicialIntraorals: many(examenClinicoInicialIntraoral),
	materialesUsados: many(materialesUsados),
	odontogramas: many(odontogramas),
	pacienteAtributosExtras: many(pacienteAtributosExtra),
	clinica: one(clinicas, {
		fields: [pacientes.idClinica],
		references: [clinicas.idClinica]
	}),
	pacientesLogins: many(pacientesLogin),
	pagos: many(pagos),
	periodontogramas: many(periodontogramas),
	planTratamientos: many(planTratamiento),
	planTratamientoProcedimientos: many(planTratamientoProcedimientos),
	recibos: many(recibos),
}));

export const tipoAntecedenteRelations = relations(tipoAntecedente, ({many}) => ({
	antecedentes: many(antecedentes),
}));

export const archivosClinicasRelations = relations(archivosClinicas, ({one}) => ({
	consulta: one(consultas, {
		fields: [archivosClinicas.idConsulta],
		references: [consultas.idConsulta]
	}),
	paciente: one(pacientes, {
		fields: [archivosClinicas.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const consultasRelations = relations(consultas, ({one, many}) => ({
	archivosClinicas: many(archivosClinicas),
	clinica: one(clinicas, {
		fields: [consultas.idClinica],
		references: [clinicas.idClinica]
	}),
	dentista: one(dentistas, {
		fields: [consultas.idDentista],
		references: [dentistas.idDentista]
	}),
	paciente: one(pacientes, {
		fields: [consultas.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const auditoriaRelations = relations(auditoria, ({one}) => ({
	clinica: one(clinicas, {
		fields: [auditoria.idClinica],
		references: [clinicas.idClinica]
	}),
}));

export const clinicasRelations = relations(clinicas, ({many}) => ({
	auditorias: many(auditoria),
	bloquesDisponibilidads: many(bloquesDisponibilidad),
	catalogoProcedimientos: many(catalogoProcedimientos),
	citas: many(citas),
	configuracionClinicas: many(configuracionClinica),
	consultas: many(consultas),
	dentistas: many(dentistas),
	lotesProductos: many(lotesProductos),
	movimientosInventarios: many(movimientosInventario),
	odontogramas: many(odontogramas),
	pacientes: many(pacientes),
	pacientesLogins: many(pacientesLogin),
	pagos: many(pagos),
	periodontogramas: many(periodontogramas),
	planTratamientos: many(planTratamiento),
	planTratamientoProcedimientos: many(planTratamientoProcedimientos),
	productos: many(productos),
	roles: many(roles),
	usuariosLogins: many(usuariosLogin),
}));

export const bloquesDisponibilidadRelations = relations(bloquesDisponibilidad, ({one}) => ({
	clinica: one(clinicas, {
		fields: [bloquesDisponibilidad.idClinica],
		references: [clinicas.idClinica]
	}),
}));

export const catalogoProcedimientosRelations = relations(catalogoProcedimientos, ({one, many}) => ({
	clinica: one(clinicas, {
		fields: [catalogoProcedimientos.idClinica],
		references: [clinicas.idClinica]
	}),
	citas: many(citas),
	planTratamientoProcedimientos: many(planTratamientoProcedimientos),
	preciosProcedimientos: many(preciosProcedimientos),
}));

export const citasRelations = relations(citas, ({one}) => ({
	clinica: one(clinicas, {
		fields: [citas.idClinica],
		references: [clinicas.idClinica]
	}),
	dentista: one(dentistas, {
		fields: [citas.idDentista],
		references: [dentistas.idDentista]
	}),
	paciente: one(pacientes, {
		fields: [citas.idPaciente],
		references: [pacientes.idPaciente]
	}),
	catalogoProcedimiento: one(catalogoProcedimientos, {
		fields: [citas.idProcedimiento],
		references: [catalogoProcedimientos.idCatalogoProcedimiento]
	}),
}));

export const dentistasRelations = relations(dentistas, ({one, many}) => ({
	citas: many(citas),
	configuracionClinicas: many(configuracionClinica),
	consultas: many(consultas),
	clinica: one(clinicas, {
		fields: [dentistas.idClinica],
		references: [clinicas.idClinica]
	}),
	odontogramaProcedimientos: many(odontogramaProcedimientos),
	periodontogramas: many(periodontogramas),
	planTratamientos: many(planTratamiento),
	usuariosLogins: many(usuariosLogin),
}));

export const configuracionClinicaRelations = relations(configuracionClinica, ({one}) => ({
	clinica: one(clinicas, {
		fields: [configuracionClinica.idClinica],
		references: [clinicas.idClinica]
	}),
	dentista: one(dentistas, {
		fields: [configuracionClinica.idDentista],
		references: [dentistas.idDentista]
	}),
}));

export const cuotasTratamientoRelations = relations(cuotasTratamiento, ({one, many}) => ({
	paciente: one(pacientes, {
		fields: [cuotasTratamiento.idPaciente],
		references: [pacientes.idPaciente]
	}),
	planTratamiento: one(planTratamiento, {
		fields: [cuotasTratamiento.idPlan],
		references: [planTratamiento.idPlan]
	}),
	pagos: many(pagos),
}));

export const planTratamientoRelations = relations(planTratamiento, ({one, many}) => ({
	cuotasTratamientos: many(cuotasTratamiento),
	odontogramaProcedimientos: many(odontogramaProcedimientos),
	pagos: many(pagos),
	clinica: one(clinicas, {
		fields: [planTratamiento.idClinica],
		references: [clinicas.idClinica]
	}),
	dentista: one(dentistas, {
		fields: [planTratamiento.idDentista],
		references: [dentistas.idDentista]
	}),
	paciente: one(pacientes, {
		fields: [planTratamiento.idPaciente],
		references: [pacientes.idPaciente]
	}),
	planTratamientoProcedimientos: many(planTratamientoProcedimientos),
}));

export const datosFacturacionRelations = relations(datosFacturacion, ({one}) => ({
	paciente: one(pacientes, {
		fields: [datosFacturacion.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const examenClinicoInicialExtraoralRelations = relations(examenClinicoInicialExtraoral, ({one}) => ({
	paciente: one(pacientes, {
		fields: [examenClinicoInicialExtraoral.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const examenClinicoInicialIntraoralRelations = relations(examenClinicoInicialIntraoral, ({one}) => ({
	paciente: one(pacientes, {
		fields: [examenClinicoInicialIntraoral.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const lotesProductosRelations = relations(lotesProductos, ({one, many}) => ({
	producto: one(productos, {
		fields: [lotesProductos.idProducto],
		references: [productos.idProducto]
	}),
	clinica: one(clinicas, {
		fields: [lotesProductos.idClinica],
		references: [clinicas.idClinica]
	}),
	materialesUsados: many(materialesUsados),
	movimientosInventarios: many(movimientosInventario),
	stockActuals: many(stockActual),
}));

export const productosRelations = relations(productos, ({one, many}) => ({
	lotesProductos: many(lotesProductos),
	materialesUsados: many(materialesUsados),
	movimientosInventarios: many(movimientosInventario),
	clinica: one(clinicas, {
		fields: [productos.idClinica],
		references: [clinicas.idClinica]
	}),
	stockActuals: many(stockActual),
}));

export const materialesUsadosRelations = relations(materialesUsados, ({one}) => ({
	lotesProducto: one(lotesProductos, {
		fields: [materialesUsados.idLote],
		references: [lotesProductos.idLote]
	}),
	paciente: one(pacientes, {
		fields: [materialesUsados.idPaciente],
		references: [pacientes.idPaciente]
	}),
	producto: one(productos, {
		fields: [materialesUsados.idProducto],
		references: [productos.idProducto]
	}),
}));

export const movimientosInventarioRelations = relations(movimientosInventario, ({one}) => ({
	clinica: one(clinicas, {
		fields: [movimientosInventario.idClinica],
		references: [clinicas.idClinica]
	}),
	lotesProducto: one(lotesProductos, {
		fields: [movimientosInventario.idLote],
		references: [lotesProductos.idLote]
	}),
	producto: one(productos, {
		fields: [movimientosInventario.idProducto],
		references: [productos.idProducto]
	}),
}));

export const odontogramaDiagnosticosRelations = relations(odontogramaDiagnosticos, ({one}) => ({
	catalogoDiagnostico: one(catalogoDiagnosticos, {
		fields: [odontogramaDiagnosticos.idCatalogoDiagnostico],
		references: [catalogoDiagnosticos.idDiagnostico]
	}),
	odontograma: one(odontogramas, {
		fields: [odontogramaDiagnosticos.idOdontograma],
		references: [odontogramas.idOdontograma]
	}),
}));

export const catalogoDiagnosticosRelations = relations(catalogoDiagnosticos, ({many}) => ({
	odontogramaDiagnosticos: many(odontogramaDiagnosticos),
}));

export const odontogramasRelations = relations(odontogramas, ({one, many}) => ({
	odontogramaDiagnosticos: many(odontogramaDiagnosticos),
	odontogramaProcedimientos: many(odontogramaProcedimientos),
	odontogramaVersiones: many(odontogramaVersiones),
	clinica: one(clinicas, {
		fields: [odontogramas.idClinica],
		references: [clinicas.idClinica]
	}),
	paciente: one(pacientes, {
		fields: [odontogramas.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const odontogramaProcedimientosRelations = relations(odontogramaProcedimientos, ({one}) => ({
	dentista: one(dentistas, {
		fields: [odontogramaProcedimientos.idDentista],
		references: [dentistas.idDentista]
	}),
	odontograma: one(odontogramas, {
		fields: [odontogramaProcedimientos.idOdontograma],
		references: [odontogramas.idOdontograma]
	}),
	planTratamiento: one(planTratamiento, {
		fields: [odontogramaProcedimientos.idPlan],
		references: [planTratamiento.idPlan]
	}),
	planTratamientoProcedimiento: one(planTratamientoProcedimientos, {
		fields: [odontogramaProcedimientos.idPlanTratamientoProcedimiento],
		references: [planTratamientoProcedimientos.idProcedimiento]
	}),
}));

export const planTratamientoProcedimientosRelations = relations(planTratamientoProcedimientos, ({one, many}) => ({
	odontogramaProcedimientos: many(odontogramaProcedimientos),
	catalogoProcedimiento: one(catalogoProcedimientos, {
		fields: [planTratamientoProcedimientos.idCatalogoProcedimiento],
		references: [catalogoProcedimientos.idCatalogoProcedimiento]
	}),
	clinica: one(clinicas, {
		fields: [planTratamientoProcedimientos.idClinica],
		references: [clinicas.idClinica]
	}),
	paciente: one(pacientes, {
		fields: [planTratamientoProcedimientos.idPaciente],
		references: [pacientes.idPaciente]
	}),
	planTratamiento: one(planTratamiento, {
		fields: [planTratamientoProcedimientos.idPlan],
		references: [planTratamiento.idPlan]
	}),
}));

export const odontogramaVersionesRelations = relations(odontogramaVersiones, ({one}) => ({
	odontograma: one(odontogramas, {
		fields: [odontogramaVersiones.idOdontograma],
		references: [odontogramas.idOdontograma]
	}),
	usuariosLogin: one(usuariosLogin, {
		fields: [odontogramaVersiones.creadoPor],
		references: [usuariosLogin.idUsuario]
	}),
}));

export const usuariosLoginRelations = relations(usuariosLogin, ({one, many}) => ({
	odontogramaVersiones: many(odontogramaVersiones),
	clinica: one(clinicas, {
		fields: [usuariosLogin.idClinica],
		references: [clinicas.idClinica]
	}),
	dentista: one(dentistas, {
		fields: [usuariosLogin.idDentista],
		references: [dentistas.idDentista]
	}),
	role: one(roles, {
		fields: [usuariosLogin.idRol],
		references: [roles.idRol]
	}),
}));

export const pacienteAtributosExtraRelations = relations(pacienteAtributosExtra, ({one}) => ({
	paciente: one(pacientes, {
		fields: [pacienteAtributosExtra.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const pacientesLoginRelations = relations(pacientesLogin, ({one}) => ({
	clinica: one(clinicas, {
		fields: [pacientesLogin.idClinica],
		references: [clinicas.idClinica]
	}),
	paciente: one(pacientes, {
		fields: [pacientesLogin.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const pagosRelations = relations(pagos, ({one, many}) => ({
	clinica: one(clinicas, {
		fields: [pagos.idClinica],
		references: [clinicas.idClinica]
	}),
	cuotasTratamiento: one(cuotasTratamiento, {
		fields: [pagos.idCuota],
		references: [cuotasTratamiento.idCuota]
	}),
	paciente: one(pacientes, {
		fields: [pagos.idPaciente],
		references: [pacientes.idPaciente]
	}),
	planTratamiento: one(planTratamiento, {
		fields: [pagos.idPlan],
		references: [planTratamiento.idPlan]
	}),
	recibos: many(recibos),
}));

export const periodontogramaDetallesRelations = relations(periodontogramaDetalles, ({one}) => ({
	periodontograma: one(periodontogramas, {
		fields: [periodontogramaDetalles.idPeriodontograma],
		references: [periodontogramas.idPeriodontograma]
	}),
}));

export const periodontogramasRelations = relations(periodontogramas, ({one, many}) => ({
	periodontogramaDetalles: many(periodontogramaDetalles),
	clinica: one(clinicas, {
		fields: [periodontogramas.idClinica],
		references: [clinicas.idClinica]
	}),
	dentista: one(dentistas, {
		fields: [periodontogramas.idDentista],
		references: [dentistas.idDentista]
	}),
	paciente: one(pacientes, {
		fields: [periodontogramas.idPaciente],
		references: [pacientes.idPaciente]
	}),
}));

export const preciosProcedimientosRelations = relations(preciosProcedimientos, ({one}) => ({
	catalogoProcedimiento: one(catalogoProcedimientos, {
		fields: [preciosProcedimientos.idCatalogoProcedimiento],
		references: [catalogoProcedimientos.idCatalogoProcedimiento]
	}),
}));

export const recibosRelations = relations(recibos, ({one}) => ({
	paciente: one(pacientes, {
		fields: [recibos.idPaciente],
		references: [pacientes.idPaciente]
	}),
	pago: one(pagos, {
		fields: [recibos.idPago],
		references: [pagos.idPago]
	}),
}));

export const rolPermisoRelations = relations(rolPermiso, ({one}) => ({
	permiso: one(permisos, {
		fields: [rolPermiso.idPermiso],
		references: [permisos.idPermiso]
	}),
	role: one(roles, {
		fields: [rolPermiso.idRol],
		references: [roles.idRol]
	}),
}));

export const permisosRelations = relations(permisos, ({many}) => ({
	rolPermisos: many(rolPermiso),
}));

export const stockActualRelations = relations(stockActual, ({one}) => ({
	lotesProducto: one(lotesProductos, {
		fields: [stockActual.idLote],
		references: [lotesProductos.idLote]
	}),
	producto: one(productos, {
		fields: [stockActual.idProducto],
		references: [productos.idProducto]
	}),
}));