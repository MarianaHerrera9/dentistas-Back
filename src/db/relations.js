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
var relations_exports = {};
__export(relations_exports, {
  adminsSaasRelations: () => adminsSaasRelations,
  antecedentesRelations: () => antecedentesRelations,
  archivosClinicasRelations: () => archivosClinicasRelations,
  auditoriaRelations: () => auditoriaRelations,
  bloquesDisponibilidadRelations: () => bloquesDisponibilidadRelations,
  catalogoDiagnosticosRelations: () => catalogoDiagnosticosRelations,
  catalogoProcedimientosRelations: () => catalogoProcedimientosRelations,
  citasRelations: () => citasRelations,
  clinicasRelations: () => clinicasRelations,
  configuracionClinicaRelations: () => configuracionClinicaRelations,
  consultasRelations: () => consultasRelations,
  cuotasTratamientoRelations: () => cuotasTratamientoRelations,
  datosFacturacionRelations: () => datosFacturacionRelations,
  dentistasRelations: () => dentistasRelations,
  examenClinicoInicialExtraoralRelations: () => examenClinicoInicialExtraoralRelations,
  examenClinicoInicialIntraoralRelations: () => examenClinicoInicialIntraoralRelations,
  lotesProductosRelations: () => lotesProductosRelations,
  materialesUsadosRelations: () => materialesUsadosRelations,
  movimientosInventarioRelations: () => movimientosInventarioRelations,
  odontogramaDiagnosticosRelations: () => odontogramaDiagnosticosRelations,
  odontogramaProcedimientosRelations: () => odontogramaProcedimientosRelations,
  odontogramaVersionesRelations: () => odontogramaVersionesRelations,
  odontogramasRelations: () => odontogramasRelations,
  pacienteAtributosExtraRelations: () => pacienteAtributosExtraRelations,
  pacientesLoginRelations: () => pacientesLoginRelations,
  pacientesRelations: () => pacientesRelations,
  pagosRelations: () => pagosRelations,
  periodontogramaDetallesRelations: () => periodontogramaDetallesRelations,
  periodontogramasRelations: () => periodontogramasRelations,
  permisosRelations: () => permisosRelations,
  planTratamientoProcedimientosRelations: () => planTratamientoProcedimientosRelations,
  planTratamientoRelations: () => planTratamientoRelations,
  preciosProcedimientosRelations: () => preciosProcedimientosRelations,
  productosRelations: () => productosRelations,
  recibosRelations: () => recibosRelations,
  rolPermisoRelations: () => rolPermisoRelations,
  rolesRelations: () => rolesRelations,
  stockActualRelations: () => stockActualRelations,
  tipoAntecedenteRelations: () => tipoAntecedenteRelations,
  usuariosLoginRelations: () => usuariosLoginRelations,
  presupuestosRelations: () => presupuestosRelations,
  presupuestoDetallesRelations: () => presupuestoDetallesRelations
});
module.exports = __toCommonJS(relations_exports);
var import_relations = require("drizzle-orm/relations");
var import_schema = require("./schema");
const adminsSaasRelations = (0, import_relations.relations)(import_schema.adminsSaas, ({ one }) => ({
  role: one(import_schema.roles, {
    fields: [import_schema.adminsSaas.idRol],
    references: [import_schema.roles.idRol]
  })
}));
const rolesRelations = (0, import_relations.relations)(import_schema.roles, ({ one, many }) => ({
  adminsSaas: many(import_schema.adminsSaas),
  rolPermisos: many(import_schema.rolPermiso),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.roles.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  usuariosLogins: many(import_schema.usuariosLogin)
}));
const antecedentesRelations = (0, import_relations.relations)(import_schema.antecedentes, ({ one }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.antecedentes.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  tipoAntecedente: one(import_schema.tipoAntecedente, {
    fields: [import_schema.antecedentes.idTipoAntecedente],
    references: [import_schema.tipoAntecedente.idTipo]
  })
}));
const pacientesRelations = (0, import_relations.relations)(import_schema.pacientes, ({ one, many }) => ({
  antecedentes: many(import_schema.antecedentes),
  archivosClinicas: many(import_schema.archivosClinicas),
  citas: many(import_schema.citas),
  consultas: many(import_schema.consultas),
  cuotasTratamientos: many(import_schema.cuotasTratamiento),
  datosFacturacions: many(import_schema.datosFacturacion),
  examenClinicoInicialExtraorals: many(import_schema.examenClinicoInicialExtraoral),
  examenClinicoInicialIntraorals: many(import_schema.examenClinicoInicialIntraoral),
  materialesUsados: many(import_schema.materialesUsados),
  odontogramas: many(import_schema.odontogramas),
  pacienteAtributosExtras: many(import_schema.pacienteAtributosExtra),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.pacientes.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  pacientesLogins: many(import_schema.pacientesLogin),
  pagos: many(import_schema.pagos),
  periodontogramas: many(import_schema.periodontogramas),
  planTratamientos: many(import_schema.planTratamiento),
  planTratamientoProcedimientos: many(import_schema.planTratamientoProcedimientos),
  recibos: many(import_schema.recibos)
}));
const tipoAntecedenteRelations = (0, import_relations.relations)(import_schema.tipoAntecedente, ({ many }) => ({
  antecedentes: many(import_schema.antecedentes)
}));
const archivosClinicasRelations = (0, import_relations.relations)(import_schema.archivosClinicas, ({ one }) => ({
  consulta: one(import_schema.consultas, {
    fields: [import_schema.archivosClinicas.idConsulta],
    references: [import_schema.consultas.idConsulta]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.archivosClinicas.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const consultasRelations = (0, import_relations.relations)(import_schema.consultas, ({ one, many }) => ({
  archivosClinicas: many(import_schema.archivosClinicas),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.consultas.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.consultas.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.consultas.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const auditoriaRelations = (0, import_relations.relations)(import_schema.auditoria, ({ one }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.auditoria.idClinica],
    references: [import_schema.clinicas.idClinica]
  })
}));
const clinicasRelations = (0, import_relations.relations)(import_schema.clinicas, ({ many }) => ({
  auditorias: many(import_schema.auditoria),
  bloquesDisponibilidads: many(import_schema.bloquesDisponibilidad),
  catalogoProcedimientos: many(import_schema.catalogoProcedimientos),
  citas: many(import_schema.citas),
  configuracionClinicas: many(import_schema.configuracionClinica),
  consultas: many(import_schema.consultas),
  dentistas: many(import_schema.dentistas),
  lotesProductos: many(import_schema.lotesProductos),
  movimientosInventarios: many(import_schema.movimientosInventario),
  odontogramas: many(import_schema.odontogramas),
  pacientes: many(import_schema.pacientes),
  pacientesLogins: many(import_schema.pacientesLogin),
  pagos: many(import_schema.pagos),
  periodontogramas: many(import_schema.periodontogramas),
  planTratamientos: many(import_schema.planTratamiento),
  planTratamientoProcedimientos: many(import_schema.planTratamientoProcedimientos),
  productos: many(import_schema.productos),
  roles: many(import_schema.roles),
  usuariosLogins: many(import_schema.usuariosLogin)
}));
const bloquesDisponibilidadRelations = (0, import_relations.relations)(import_schema.bloquesDisponibilidad, ({ one }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.bloquesDisponibilidad.idClinica],
    references: [import_schema.clinicas.idClinica]
  })
}));
const catalogoProcedimientosRelations = (0, import_relations.relations)(import_schema.catalogoProcedimientos, ({ one, many }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.catalogoProcedimientos.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  citas: many(import_schema.citas),
  planTratamientoProcedimientos: many(import_schema.planTratamientoProcedimientos),
  preciosProcedimientos: many(import_schema.preciosProcedimientos)
}));
const citasRelations = (0, import_relations.relations)(import_schema.citas, ({ one }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.citas.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.citas.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.citas.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  catalogoProcedimiento: one(import_schema.catalogoProcedimientos, {
    fields: [import_schema.citas.idProcedimiento],
    references: [import_schema.catalogoProcedimientos.idCatalogoProcedimiento]
  })
}));
const dentistasRelations = (0, import_relations.relations)(import_schema.dentistas, ({ one, many }) => ({
  citas: many(import_schema.citas),
  configuracionClinicas: many(import_schema.configuracionClinica),
  consultas: many(import_schema.consultas),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.dentistas.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  odontogramaProcedimientos: many(import_schema.odontogramaProcedimientos),
  periodontogramas: many(import_schema.periodontogramas),
  planTratamientos: many(import_schema.planTratamiento),
  usuariosLogins: many(import_schema.usuariosLogin)
}));
const configuracionClinicaRelations = (0, import_relations.relations)(import_schema.configuracionClinica, ({ one }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.configuracionClinica.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.configuracionClinica.idDentista],
    references: [import_schema.dentistas.idDentista]
  })
}));
const cuotasTratamientoRelations = (0, import_relations.relations)(import_schema.cuotasTratamiento, ({ one, many }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.cuotasTratamiento.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  planTratamiento: one(import_schema.planTratamiento, {
    fields: [import_schema.cuotasTratamiento.idPlan],
    references: [import_schema.planTratamiento.idPlan]
  }),
  pagos: many(import_schema.pagos)
}));
const planTratamientoRelations = (0, import_relations.relations)(import_schema.planTratamiento, ({ one, many }) => ({
  cuotasTratamientos: many(import_schema.cuotasTratamiento),
  odontogramaProcedimientos: many(import_schema.odontogramaProcedimientos),
  pagos: many(import_schema.pagos),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.planTratamiento.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.planTratamiento.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.planTratamiento.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  planTratamientoProcedimientos: many(import_schema.planTratamientoProcedimientos)
}));
const datosFacturacionRelations = (0, import_relations.relations)(import_schema.datosFacturacion, ({ one }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.datosFacturacion.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const examenClinicoInicialExtraoralRelations = (0, import_relations.relations)(import_schema.examenClinicoInicialExtraoral, ({ one }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.examenClinicoInicialExtraoral.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const examenClinicoInicialIntraoralRelations = (0, import_relations.relations)(import_schema.examenClinicoInicialIntraoral, ({ one }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.examenClinicoInicialIntraoral.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const lotesProductosRelations = (0, import_relations.relations)(import_schema.lotesProductos, ({ one, many }) => ({
  producto: one(import_schema.productos, {
    fields: [import_schema.lotesProductos.idProducto],
    references: [import_schema.productos.idProducto]
  }),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.lotesProductos.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  materialesUsados: many(import_schema.materialesUsados),
  movimientosInventarios: many(import_schema.movimientosInventario),
  stockActuals: many(import_schema.stockActual)
}));
const productosRelations = (0, import_relations.relations)(import_schema.productos, ({ one, many }) => ({
  lotesProductos: many(import_schema.lotesProductos),
  materialesUsados: many(import_schema.materialesUsados),
  movimientosInventarios: many(import_schema.movimientosInventario),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.productos.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  stockActuals: many(import_schema.stockActual)
}));
const materialesUsadosRelations = (0, import_relations.relations)(import_schema.materialesUsados, ({ one }) => ({
  lotesProducto: one(import_schema.lotesProductos, {
    fields: [import_schema.materialesUsados.idLote],
    references: [import_schema.lotesProductos.idLote]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.materialesUsados.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  producto: one(import_schema.productos, {
    fields: [import_schema.materialesUsados.idProducto],
    references: [import_schema.productos.idProducto]
  })
}));
const movimientosInventarioRelations = (0, import_relations.relations)(import_schema.movimientosInventario, ({ one }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.movimientosInventario.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  lotesProducto: one(import_schema.lotesProductos, {
    fields: [import_schema.movimientosInventario.idLote],
    references: [import_schema.lotesProductos.idLote]
  }),
  producto: one(import_schema.productos, {
    fields: [import_schema.movimientosInventario.idProducto],
    references: [import_schema.productos.idProducto]
  })
}));
const odontogramaDiagnosticosRelations = (0, import_relations.relations)(import_schema.odontogramaDiagnosticos, ({ one }) => ({
  catalogoDiagnostico: one(import_schema.catalogoDiagnosticos, {
    fields: [import_schema.odontogramaDiagnosticos.idCatalogoDiagnostico],
    references: [import_schema.catalogoDiagnosticos.idDiagnostico]
  }),
  odontograma: one(import_schema.odontogramas, {
    fields: [import_schema.odontogramaDiagnosticos.idOdontograma],
    references: [import_schema.odontogramas.idOdontograma]
  })
}));
const catalogoDiagnosticosRelations = (0, import_relations.relations)(import_schema.catalogoDiagnosticos, ({ many }) => ({
  odontogramaDiagnosticos: many(import_schema.odontogramaDiagnosticos)
}));
const odontogramasRelations = (0, import_relations.relations)(import_schema.odontogramas, ({ one, many }) => ({
  odontogramaDiagnosticos: many(import_schema.odontogramaDiagnosticos),
  odontogramaProcedimientos: many(import_schema.odontogramaProcedimientos),
  odontogramaVersiones: many(import_schema.odontogramaVersiones),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.odontogramas.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.odontogramas.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const odontogramaProcedimientosRelations = (0, import_relations.relations)(import_schema.odontogramaProcedimientos, ({ one }) => ({
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.odontogramaProcedimientos.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  odontograma: one(import_schema.odontogramas, {
    fields: [import_schema.odontogramaProcedimientos.idOdontograma],
    references: [import_schema.odontogramas.idOdontograma]
  }),
  planTratamiento: one(import_schema.planTratamiento, {
    fields: [import_schema.odontogramaProcedimientos.idPlan],
    references: [import_schema.planTratamiento.idPlan]
  }),
  planTratamientoProcedimiento: one(import_schema.planTratamientoProcedimientos, {
    fields: [import_schema.odontogramaProcedimientos.idPlanTratamientoProcedimiento],
    references: [import_schema.planTratamientoProcedimientos.idProcedimiento]
  })
}));
const planTratamientoProcedimientosRelations = (0, import_relations.relations)(import_schema.planTratamientoProcedimientos, ({ one, many }) => ({
  odontogramaProcedimientos: many(import_schema.odontogramaProcedimientos),
  catalogoProcedimiento: one(import_schema.catalogoProcedimientos, {
    fields: [import_schema.planTratamientoProcedimientos.idCatalogoProcedimiento],
    references: [import_schema.catalogoProcedimientos.idCatalogoProcedimiento]
  }),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.planTratamientoProcedimientos.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.planTratamientoProcedimientos.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  planTratamiento: one(import_schema.planTratamiento, {
    fields: [import_schema.planTratamientoProcedimientos.idPlan],
    references: [import_schema.planTratamiento.idPlan]
  })
}));
const odontogramaVersionesRelations = (0, import_relations.relations)(import_schema.odontogramaVersiones, ({ one }) => ({
  odontograma: one(import_schema.odontogramas, {
    fields: [import_schema.odontogramaVersiones.idOdontograma],
    references: [import_schema.odontogramas.idOdontograma]
  }),
  usuariosLogin: one(import_schema.usuariosLogin, {
    fields: [import_schema.odontogramaVersiones.creadoPor],
    references: [import_schema.usuariosLogin.idUsuario]
  })
}));
const usuariosLoginRelations = (0, import_relations.relations)(import_schema.usuariosLogin, ({ one, many }) => ({
  odontogramaVersiones: many(import_schema.odontogramaVersiones),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.usuariosLogin.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.usuariosLogin.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  role: one(import_schema.roles, {
    fields: [import_schema.usuariosLogin.idRol],
    references: [import_schema.roles.idRol]
  })
}));
const pacienteAtributosExtraRelations = (0, import_relations.relations)(import_schema.pacienteAtributosExtra, ({ one }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.pacienteAtributosExtra.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const pacientesLoginRelations = (0, import_relations.relations)(import_schema.pacientesLogin, ({ one }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.pacientesLogin.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.pacientesLogin.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const pagosRelations = (0, import_relations.relations)(import_schema.pagos, ({ one, many }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.pagos.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  cuotasTratamiento: one(import_schema.cuotasTratamiento, {
    fields: [import_schema.pagos.idCuota],
    references: [import_schema.cuotasTratamiento.idCuota]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.pagos.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  planTratamiento: one(import_schema.planTratamiento, {
    fields: [import_schema.pagos.idPlan],
    references: [import_schema.planTratamiento.idPlan]
  }),
  recibos: many(import_schema.recibos)
}));
const periodontogramaDetallesRelations = (0, import_relations.relations)(import_schema.periodontogramaDetalles, ({ one }) => ({
  periodontograma: one(import_schema.periodontogramas, {
    fields: [import_schema.periodontogramaDetalles.idPeriodontograma],
    references: [import_schema.periodontogramas.idPeriodontograma]
  })
}));
const periodontogramasRelations = (0, import_relations.relations)(import_schema.periodontogramas, ({ one, many }) => ({
  periodontogramaDetalles: many(import_schema.periodontogramaDetalles),
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.periodontogramas.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.periodontogramas.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.periodontogramas.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  })
}));
const preciosProcedimientosRelations = (0, import_relations.relations)(import_schema.preciosProcedimientos, ({ one }) => ({
  catalogoProcedimiento: one(import_schema.catalogoProcedimientos, {
    fields: [import_schema.preciosProcedimientos.idCatalogoProcedimiento],
    references: [import_schema.catalogoProcedimientos.idCatalogoProcedimiento]
  })
}));
const recibosRelations = (0, import_relations.relations)(import_schema.recibos, ({ one }) => ({
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.recibos.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  pago: one(import_schema.pagos, {
    fields: [import_schema.recibos.idPago],
    references: [import_schema.pagos.idPago]
  })
}));
const rolPermisoRelations = (0, import_relations.relations)(import_schema.rolPermiso, ({ one }) => ({
  permiso: one(import_schema.permisos, {
    fields: [import_schema.rolPermiso.idPermiso],
    references: [import_schema.permisos.idPermiso]
  }),
  role: one(import_schema.roles, {
    fields: [import_schema.rolPermiso.idRol],
    references: [import_schema.roles.idRol]
  })
}));
const permisosRelations = (0, import_relations.relations)(import_schema.permisos, ({ many }) => ({
  rolPermisos: many(import_schema.rolPermiso)
}));
const stockActualRelations = (0, import_relations.relations)(import_schema.stockActual, ({ one }) => ({
  lotesProducto: one(import_schema.lotesProductos, {
    fields: [import_schema.stockActual.idLote],
    references: [import_schema.lotesProductos.idLote]
  }),
  producto: one(import_schema.productos, {
    fields: [import_schema.stockActual.idProducto],
    references: [import_schema.productos.idProducto]
  })
}));

const presupuestosRelations = (0, import_relations.relations)(import_schema.presupuestos, ({ one, many }) => ({
  clinica: one(import_schema.clinicas, {
    fields: [import_schema.presupuestos.idClinica],
    references: [import_schema.clinicas.idClinica]
  }),
  paciente: one(import_schema.pacientes, {
    fields: [import_schema.presupuestos.idPaciente],
    references: [import_schema.pacientes.idPaciente]
  }),
  dentista: one(import_schema.dentistas, {
    fields: [import_schema.presupuestos.idDentista],
    references: [import_schema.dentistas.idDentista]
  }),
  detalles: many(import_schema.presupuestoDetalles)
}));

const presupuestoDetallesRelations = (0, import_relations.relations)(import_schema.presupuestoDetalles, ({ one }) => ({
  presupuesto: one(import_schema.presupuestos, {
    fields: [import_schema.presupuestoDetalles.idPresupuesto],
    references: [import_schema.presupuestos.idPresupuesto]
  }),
  procedimiento: one(import_schema.catalogoProcedimientos, {
    fields: [import_schema.presupuestoDetalles.idCatalogoProcedimiento],
    references: [import_schema.catalogoProcedimientos.idCatalogoProcedimiento]
  })
}));

