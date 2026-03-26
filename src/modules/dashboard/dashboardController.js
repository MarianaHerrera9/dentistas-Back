const db = require("../../config/db");

const DashboardController = {
  // ----- RECEPCIONISTA (CRM) -----
  async getReceptionTasks(req, res) {
    try {
      const { id_clinica } = req.params;

      // 1. Citas próximas (mañana y pasado mañana) pendientes
      const [citasRows] = await db.execute(
        `SELECT c.id_cita, c.fecha_cita, c.hora_inicio, c.estado, p.nombre, p.apellido_paterno, p.telefono, p.correo
         FROM citas c
         JOIN pacientes p ON c.id_paciente = p.id_paciente
         WHERE c.id_clinica = ? 
           AND c.estado IN ('Pendiente')
           AND c.fecha_cita >= DATE_ADD(CURDATE(), INTERVAL 1 DAY)
           AND c.fecha_cita <= DATE_ADD(CURDATE(), INTERVAL 2 DAY)`,
        [id_clinica]
      );

      // 2. Cumpleaños del día
      const [cumpleanosRows] = await db.execute(
        `SELECT id_paciente, nombre, apellido_paterno, fecha_nacimiento, telefono, correo
         FROM pacientes
         WHERE id_clinica = ?
           AND MONTH(fecha_nacimiento) = MONTH(CURDATE())
           AND DAY(fecha_nacimiento) = DAY(CURDATE())`,
        [id_clinica]
      );

      // 3. Re-Marketing (Limpieza/Control > 6 meses)
      const [remarketingRows] = await db.execute(
        `SELECT pt.id_plan, pt.fecha_fin_estimada, pt.nombre_plan, p.id_paciente, p.nombre, p.apellido_paterno, p.telefono, p.correo
         FROM plan_tratamiento pt
         JOIN pacientes p ON pt.id_paciente = p.id_paciente
         WHERE pt.id_clinica = ?
           AND pt.estado = 'Completado'
           AND pt.fecha_fin_estimada <= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
           AND pt.fecha_fin_estimada >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)`,
        [id_clinica]
      );

      // 4. Cobranza (Cuotas pendientes > 15 días)
      const [cobranzaRows] = await db.execute(
        `SELECT ct.id_cuota, ct.monto, ct.fecha_programada, p.id_paciente, p.nombre, p.apellido_paterno, p.telefono, p.correo
         FROM cuotas_tratamiento ct
         JOIN pacientes p ON ct.id_paciente = p.id_paciente
         JOIN plan_tratamiento pt ON ct.id_plan = pt.id_plan
         WHERE pt.id_clinica = ?
           AND ct.pagada = 0
           AND ct.fecha_programada <= DATE_SUB(CURDATE(), INTERVAL 15 DAY)`,
        [id_clinica]
      );

      return res.json({
        citasProximas: citasRows,
        cumpleanos: cumpleanosRows,
        remarketing: remarketingRows,
        cobranza: cobranzaRows
      });
    } catch (error) {
      console.error("Error al obtener tareas de recepciónCRM:", error);
      res.status(500).json({ message: "Error al obtener tareas (CRM)", error: error.message });
    }
  },

  // ----- DENTISTA -----
  async getDentistMetrics(req, res) {
    try {
      const { id_clinica, id_dentista } = req.params;
      
      const [agendaHoy] = await db.execute(
        `SELECT c.id_cita, c.fecha_cita, c.hora_inicio, c.hora_fin, c.estado, p.id_paciente, p.nombre, p.apellido_paterno
         FROM citas c
         JOIN pacientes p ON c.id_paciente = p.id_paciente
         WHERE c.id_clinica = ? AND c.id_dentista = ?
           AND c.fecha_cita = CURDATE()
         ORDER BY c.hora_inicio ASC`,
        [id_clinica, id_dentista]
      );

      return res.json({
        agendaHoy
      });
    } catch (error) {
       console.error("Error al obtener métricas dentista:", error);
       res.status(500).json({ message: "Error al obtener métricas dentista" });
    }
  },

  // ----- ADMINISTRADOR -----
  async getAdminMetrics(req, res) {
    try {
      const { id_clinica } = req.params;
      
      const [ingresosTotales] = await db.execute(
        `SELECT SUM(monto) as total FROM pagos WHERE id_clinica = ?`, [id_clinica]
      );
      
      const [cxcTotales] = await db.execute(
        `SELECT SUM(ct.monto) as total
         FROM cuotas_tratamiento ct
         JOIN plan_tratamiento pt ON ct.id_plan = pt.id_plan
         WHERE pt.id_clinica = ? AND ct.pagada = 0`,
        [id_clinica]
      );
      
      const [nuevosPacientes] = await db.execute(
        `SELECT COUNT(*) as total FROM pacientes WHERE id_clinica = ? AND MONTH(fecha_registro) = MONTH(CURDATE()) AND YEAR(fecha_registro) = YEAR(CURDATE())`, 
        [id_clinica]
      );

      return res.json({
        ingresosTotales: ingresosTotales[0]?.total || 0,
        cxcTotales: cxcTotales[0]?.total || 0,
        nuevosPacientesRegistrados: nuevosPacientes[0]?.total || 0
      });
    } catch(err) {
       console.error(err);
       res.status(500).json({ message: "Error al obtener métricas de admin" });
    }
  },

  // ----- NOTAS / PENDIENTES -----
  async getNotes(req, res) {
    try {
      const { id_clinica, id_usuario } = req.params;
      const [notes] = await db.execute(
        `SELECT * FROM notas_pendientes 
         WHERE id_clinica = ? AND id_usuario = ?
         ORDER BY completada ASC, created_at DESC`,
        [id_clinica, id_usuario]
      );
      res.json(notes);
    } catch (error) {
      console.error("Error al obtener notas:", error);
      res.status(500).json({ message: "Error al obtener notas (o tabla inexistente)" });
    }
  },

  async createNote(req, res) {
    try {
      const { id_clinica, id_usuario, texto_nota } = req.body;
      const [result] = await db.execute(
        `INSERT INTO notas_pendientes (id_clinica, id_usuario, texto_nota) VALUES (?, ?, ?)`,
        [id_clinica, id_usuario, texto_nota]
      );
      res.status(201).json({ message: "Nota creada", id_nota: result.insertId, texto_nota, completada: 0 });
    } catch (error) {
      console.error("Error al crear nota:", error);
      res.status(500).json({ message: "Error al crear nota" });
    }
  },

  async updateNote(req, res) {
    try {
      const { id_nota } = req.params;
      const { completada, texto_nota } = req.body;
      if (texto_nota !== undefined) {
          await db.execute(
            `UPDATE notas_pendientes SET texto_nota = ?, completada = ? WHERE id_nota = ?`,
            [texto_nota, completada ? 1 : 0, id_nota]
          );
      } else {
          await db.execute(
            `UPDATE notas_pendientes SET completada = ? WHERE id_nota = ?`,
            [completada ? 1 : 0, id_nota]
          );
      }
      res.json({ message: "Nota actualizada" });
    } catch (error) {
      console.error("Error al actualizar nota:", error);
      res.status(500).json({ message: "Error al actualizar nota" });
    }
  },

  async deleteNote(req, res) {
    try {
      const { id_nota } = req.params;
      await db.execute(
        `DELETE FROM notas_pendientes WHERE id_nota = ?`,
        [id_nota]
      );
      res.json({ message: "Nota eliminada" });
    } catch (error) {
      console.error("Error al eliminar nota:", error);
      res.status(500).json({ message: "Error al eliminar nota" });
    }
  },

  // ----- TABLERO KANBAN DE TAREAS -----
  async getBoardTasks(req, res) {
    try {
      const { id_clinica, id_usuario } = req.params;
      const [tasks] = await db.execute(
        `SELECT t.*, 
                u1.usuario AS creador_nombre,
                u2.usuario AS asignado_nombre
         FROM tareas_tablero t
         LEFT JOIN usuarios_login u1 ON t.creado_por = u1.id_usuario
         LEFT JOIN usuarios_login u2 ON t.id_asignado = u2.id_usuario
         WHERE t.id_clinica = ? AND (t.creado_por = ? OR t.id_asignado = ?)
         ORDER BY t.created_at DESC`,
        [id_clinica, id_usuario, id_usuario]
      );
      res.json(tasks);
    } catch (error) {
      console.error("Error al obtener tareas del tablero:", error);
      res.status(500).json({ message: "Error al obtener tareas del tablero" });
    }
  },

  async createBoardTask(req, res) {
    try {
      const { id_clinica, creado_por, id_asignado, titulo, descripcion, estado } = req.body;
      const finalEstado = estado || 'Pendiente';
      const asignado = id_asignado ? id_asignado : null;

      const [result] = await db.execute(
        `INSERT INTO tareas_tablero (id_clinica, creado_por, id_asignado, titulo, descripcion, estado) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_clinica, creado_por, asignado, titulo, descripcion, finalEstado]
      );
      
      res.status(201).json({ 
        message: "Tarea creada exitosamente", 
        id_tarea: result.insertId,
        id_clinica, creado_por, id_asignado: asignado, titulo, descripcion, estado: finalEstado
      });
    } catch (error) {
      console.error("Error al crear tarea:", error);
      res.status(500).json({ message: "Error al crear tarea" });
    }
  },

  async updateBoardTask(req, res) {
    try {
      const { id_tarea } = req.params;
      const { id_asignado, titulo, descripcion, estado } = req.body;
      const asignado = id_asignado ? id_asignado : null;

      await db.execute(
        `UPDATE tareas_tablero 
         SET id_asignado = ?, titulo = ?, descripcion = ?, estado = ? 
         WHERE id_tarea = ?`,
        [asignado, titulo, descripcion, estado, id_tarea]
      );
      res.json({ message: "Tarea actualizada" });
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      res.status(500).json({ message: "Error al actualizar tarea" });
    }
  },

  async updateBoardTaskStatus(req, res) {
    try {
      const { id_tarea } = req.params;
      const { estado } = req.body;
      
      await db.execute(
        `UPDATE tareas_tablero SET estado = ? WHERE id_tarea = ?`,
        [estado, id_tarea]
      );
      res.json({ message: "Estado de la tarea actualizado" });
    } catch (error) {
      console.error("Error al actualizar estado de la tarea:", error);
      res.status(500).json({ message: "Error al actualizar estado de la tarea" });
    }
  },

  async deleteBoardTask(req, res) {
    try {
      const { id_tarea } = req.params;
      await db.execute(
        `DELETE FROM tareas_tablero WHERE id_tarea = ?`,
        [id_tarea]
      );
      res.json({ message: "Tarea eliminada exitosamente" });
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      res.status(500).json({ message: "Error al eliminar tarea" });
    }
  }
};

module.exports = DashboardController;
