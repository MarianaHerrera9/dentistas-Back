const { mysqlTable, int, varchar, text, timestamp, mysqlEnum, date, decimal } = require('drizzle-orm/mysql-core');
const { clinicas, pacientes } = require('../../db/schema');

const laboratoriosDirectorio = mysqlTable('laboratorios_directorio', {
  id: int('id').autoincrement().primaryKey(),
  clinicId: int('clinic_id').notNull().references(() => clinicas.idClinica, { onDelete: 'cascade' }),
  nombre: varchar('nombre', { length: 150 }).notNull(),
  telefono: varchar('telefono', { length: 20 }),
  direccion: text('direccion'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
});

const trabajosLaboratorio = mysqlTable('trabajos_laboratorio', {
  id: int('id').autoincrement().primaryKey(),
  clinicId: int('clinic_id').notNull().references(() => clinicas.idClinica, { onDelete: 'cascade' }),
  patientId: int('patient_id').notNull().references(() => pacientes.idPaciente, { onDelete: 'cascade' }),
  labId: int('lab_id').notNull().references(() => laboratoriosDirectorio.id, { onDelete: 'restrict' }),
  workType: varchar('work_type', { length: 100 }).notNull(),
  status: mysqlEnum('status', ['Enviado', 'En_Proceso', 'Prueba', 'Modificacion', 'Terminado_Entregado']).default('Enviado'),
  sendDate: date('send_date', { mode: 'string' }).notNull(),
  expectedDate: date('expected_date', { mode: 'string' }),
  cost: decimal('cost', { precision: 10, scale: 2 }).default('0.00'),
  notas: text('notas'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow()
});

module.exports = { laboratoriosDirectorio, trabajosLaboratorio };
