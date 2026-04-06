const db = require('../../config/db');

const Dentista = require('./dentistaModel'); 
const { createDentistaConUsuario } = require('./dentistasConUsuarioService');

const DentistaController = {
  async getAllByClinica(req, res) {
    try {
      res.set('Cache-Control', 'no-store');
      const { id_clinica } = req.params;

      const [rows] = await db.execute(
        `SELECT 
          id_dentista,
          nombre,  
          apellido_paterno, 
          apellido_materno,
          telefono,
          correo,
          especialidad,
          color,
          cedula_profesional,
          institucion_egreso,
          titulo_otorgado,
          fecha_registro,
          CASE WHEN activo = 1 THEN 'Activo' ELSE 'Inactivo' END AS status
        FROM dentistas
        WHERE id_clinica = ?`,
        [id_clinica]
      );

      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  async create(req, res) {
    try {
      const data = req.body;

      if (!data.id_clinica || !data.nombre || !data.correo) {
        return res.status(400).json({ message: 'Faltan campos requeridos.' });
      }

      const insertId = await Dentista.create(data);

      res.status(201).json({
        message: 'Dentista creado exitosamente',
        id_dentista: insertId
      });
    } catch (error) {
      console.error("Error en create:", error);
      res.status(500).json({ message: 'Error al crear el dentista' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const dentista = await Dentista.findById(id);
      
      if (!dentista) {
        return res.status(404).json({ message: 'Dentista no encontrado' });
      }
      
      res.status(200).json(dentista);
    } catch (error) {
      console.error("Error en getById dentista:", error);
      res.status(500).json({ message: 'Error al obtener el dentista' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID de dentista es requerido.' });
      }

      const success = await Dentista.update(id, data);

      if (success) {
        res.status(200).json({ message: 'Dentista actualizado exitosamente' });
      } else {
        res.status(404).json({ message: 'Dentista no encontrado' });
      }
    } catch (error) {
      console.error("Error en update:", error);
      res.status(500).json({ message: 'Error al actualizar el dentista' });
    }
  },

  async inactivarDentista(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body; 

    const success = await Dentista.inactivarDentista(id, activo);

    if (success) {
      res.status(200).json({ 
        message: activo ? 'Dentista activado' : 'Dentista inactivado' 
      });
    } else {
      res.status(404).json({ message: 'Dentista no encontrado' });
    }
  } catch (error) {
    console.error("Error en toggleStatus:", error);
    res.status(500).json({ message: 'Error al cambiar estado del dentista' });
  }
},
 async createConUsuario(req, res) {
    try {
      const { dentistaData, usuarioData, id_clinica } = req.body;

      if (!dentistaData || !usuarioData || !id_clinica) {
        return res.status(400).json({ mensaje: 'Faltan datos para crear dentista y usuario' });
      }

      const result = await createDentistaConUsuario({ dentistaData, usuarioData, id_clinica });

      res.status(201).json({ mensaje: 'Dentista y usuario creados', data: result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ mensaje: 'Error al crear dentista y usuario' });
    }
  }
};

module.exports = DentistaController;