const db = require("../../config/db");
const supabase = require("../../config/supabase");
const path = require("path");

const ClinicaController = {

  async getAll(req, res) {
    try {
      const [rows] = await db.execute(`
      SELECT 
        id_clinica,
        nombre,
        subdominio,
        direccion,
        telefono,
        correo_contacto AS correo,
        plan_saas AS plan,
        logo_url,
        color_principal,
        color_secundario,
        color_extra,
        activo
      FROM clinicas
      ORDER BY id_clinica DESC
    `);

      const clinicas = await Promise.all(
          rows.map(async (clinica) => {
            if (clinica.logo_url) {
              const { data, error } = await supabase.storage
                  .from("archivos")
                  .createSignedUrl(clinica.logo_url, 60 * 60);

              if (!error && data?.signedUrl) {
                clinica.logo_url = data.signedUrl;
              } else {
                clinica.logo_url = null;
              }
            }

            return clinica;
          })
      );

      res.json(clinicas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener clínicas" });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const [rows] = await db.execute(
        `
        SELECT 
          id_clinica,
          nombre,
          subdominio,
          direccion,
          telefono,
          correo_contacto AS correo,
          plan_saas AS plan,
          logo_url,
          color_principal,
          color_secundario,
          color_extra
        FROM clinicas
        WHERE id_clinica = ?
        `,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "No encontrada" });
      }

      const clinica = rows[0];

      if (clinica.logo_url) {
        const { data, error } = await supabase.storage
          .from("archivos")
          .createSignedUrl(clinica.logo_url, 60 * 60); 

        if (!error && data?.signedUrl) {
          clinica.logo_url = data.signedUrl;
        } else {
          clinica.logo_url = null;
        }
      }

      res.json(clinica);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener clínica" });
    }
  },

  async update(req, res) {
  try {
    const { id } = req.params;
    await db.execute(
      `
      UPDATE clinicas SET
        nombre = ?,
        direccion = ?,
        telefono = ?,
        correo_contacto = ?,
        color_principal = ?,
        color_secundario = ?,
        color_extra = ?
      WHERE id_clinica = ?
      `,
      [
        req.body.nombre,
        req.body.direccion,
        req.body.telefono,
        req.body.correo_contacto,
        req.body.color_principal,
        req.body.color_secundario,
        req.body.color_extra,
        id,
      ]
    );

    const [rows] = await db.execute(
      `
      SELECT 
        id_clinica,
        nombre,
        subdominio,
        direccion,
        telefono,
        correo_contacto AS correo,
        plan_saas AS plan,
        logo_url,
        color_principal,
        color_secundario,
        color_extra
      FROM clinicas
      WHERE id_clinica = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "No encontrada" });
    }

    const clinica = rows[0];

    if (clinica.logo_url) {
      const { data, error } = await supabase.storage
        .from("archivos")
        .createSignedUrl(clinica.logo_url, 60 * 60);

      if (!error && data?.signedUrl) {
        clinica.logo_url = data.signedUrl;
      } else {
        clinica.logo_url = null;
      }
    }

    res.json(clinica);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar clínica" });
  }
},

  async uploadLogo(req, res) {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Archivo requerido" });
    }

    const ext = path.extname(req.file.originalname);
    const filePath = `clinicas/${id}/logo-${Date.now()}${ext}`;

    const { error } = await supabase.storage
      .from("archivos")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    await db.execute(
      "UPDATE clinicas SET logo_url = ? WHERE id_clinica = ?",
      [filePath, id]
    );

    const [rows] = await db.execute(
      `
      SELECT 
        id_clinica,
        nombre,
        subdominio,
        direccion,
        telefono,
        correo_contacto AS correo,
        plan_saas AS plan,
        logo_url,
        color_principal,
        color_secundario,
        color_extra
      FROM clinicas
      WHERE id_clinica = ?
      `,
      [id]
    );

    const clinica = rows[0];

    if (clinica.logo_url) {
      const { data, error } = await supabase.storage
        .from("archivos")
        .createSignedUrl(clinica.logo_url, 60 * 60);

      if (!error && data?.signedUrl) {
        clinica.logo_url = data.signedUrl;
      } else {
        clinica.logo_url = null;
      }
    }

    res.json(clinica);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir logo" });
  }
}
};

module.exports = ClinicaController;
