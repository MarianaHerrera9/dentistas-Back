const Receta = require('./recetaModel');

const RecetasController = {
  async create(req, res) {
    try {
      const data = req.body;
      
      // Basic validation
      const mandatoryFields = [
        'id_clinica', 'id_paciente', 'id_dentista'
      ];
      
      for (const field of mandatoryFields) {
        if (!data[field]) {
          return res.status(400).json({ message: `El campo base ${field} es obligatorio.` });
        }
      }

      if (!data.medicamentos || !Array.isArray(data.medicamentos) || data.medicamentos.length === 0) {
        return res.status(400).json({ message: `Debe incluir al menos un medicamento en la receta.` });
      }

      const mandatoryMedFields = [
        'nombre_generico', 'forma_farmaceutica', 'dosis', 
        'presentacion', 'frecuencia', 'via_administracion', 
        'duracion_tratamiento', 'indicaciones'
      ];

      for (let i = 0; i < data.medicamentos.length; i++) {
        const med = data.medicamentos[i];
        for (const field of mandatoryMedFields) {
          if (!med[field]) {
             return res.status(400).json({ message: `El campo ${field} es obligatorio en el medicamento #${i + 1}.` });
          }
        }
      }

      const insertId = await Receta.create(data);
      res.status(201).json({
        message: 'Receta creada exitosamente',
        id_receta: insertId
      });
    } catch (error) {
      console.error("Error en create receta:", error);
      res.status(500).json({ message: 'Error al crear la receta' });
    }
  },

  async getByPaciente(req, res) {
    try {
      const { id_paciente } = req.params;
      const data = await Receta.getAllByPaciente(id_paciente);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error en getByPaciente:", error);
      res.status(500).json({ message: 'Error al obtener las recetas' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const data = await Receta.getById(id);
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: 'Receta no encontrada' });
      }
    } catch (error) {
      console.error("Error en getById:", error);
      res.status(500).json({ message: 'Error al obtener la receta' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const success = await Receta.delete(id);
      if (success) {
        res.status(200).json({ message: 'Receta eliminada exitosamente' });
      } else {
        res.status(404).json({ message: 'Receta no encontrada' });
      }
    } catch (error) {
      console.error("Error en delete receta:", error);
      res.status(500).json({ message: 'Error al eliminar la receta' });
    }
  }
};

module.exports = RecetasController;
