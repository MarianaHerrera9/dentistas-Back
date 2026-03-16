const db = require('../../config/db');

const PeriodontogramaModel = {

    async create(data) {
        const sql = `
      INSERT INTO periodontogramas
      (id_clinica, id_paciente, id_dentista, notas)
      VALUES (?, ?, ?, ?)
    `;

        const [result] = await db.query(sql, [
            data.id_clinica,
            data.id_paciente,
            data.id_dentista,
            data.notas || null
        ]);

        return result.insertId;
    },

    async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM periodontogramas WHERE id_periodontograma = ?`,
            [id]
        );

        return rows[0];
    },

    async delete(id) {
        await db.query(
            `DELETE FROM periodontogramas WHERE id_periodontograma = ?`,
            [id]
        );
    },

    async findByPaciente(idPaciente) {
        const [rows] = await db.query(
            `SELECT * FROM periodontogramas
       WHERE id_paciente = ?
       ORDER BY fecha_registro DESC`,
            [idPaciente]
        );

        return rows;
    },

    async update(id, data) {
        const fields = [];
        const values = [];

        if (data.estado) {
            fields.push("estado = ?");
            values.push(data.estado);
        }
        if (data.notas !== undefined) {
            fields.push("notas = ?");
            values.push(data.notas);
        }
        if (data.nota_cierre !== undefined) {
            fields.push("nota_cierre = ?");
            values.push(data.nota_cierre);
        }

        if (fields.length === 0) return;

        values.push(id);
        const sql = `UPDATE periodontogramas SET ${fields.join(", ")}, updated_at = NOW() WHERE id_periodontograma = ?`;
        await db.query(sql, values);
    },

    async finalizar(id, nota_cierre) {
        await db.query(
            `UPDATE periodontogramas
       SET estado = 'completed',
       nota_cierre = ?,
       updated_at = NOW()
       WHERE id_periodontograma = ?`,
            [nota_cierre || null, id]
        );
    },

    async createDetalle(id_periodontograma, data) {

        const sql = `
    INSERT INTO periodontograma_detalles
    (
      id_periodontograma,
      numero_diente,
      ausente,
      cara,
      margen_m, margen_c, margen_d,
      sondaje_m, sondaje_c, sondaje_d,
      sangrado_m, sangrado_c, sangrado_d,
      supuracion_m, supuracion_c, supuracion_d,
      placa_m, placa_c, placa_d,
      implante,
      movilidad,
      furca,
      pronostico_individual,
      encia_queratinizada,
      nota
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

        const [result] = await db.query(sql, [
            id_periodontograma,
            data.numero_diente,
            data.ausente || 0,
            data.cara,

            data.margen_m,
            data.margen_c,
            data.margen_d,

            data.sondaje_m,
            data.sondaje_c,
            data.sondaje_d,

            data.sangrado_m ?? 0,
            data.sangrado_c ?? 0,
            data.sangrado_d ?? 0,

            data.supuracion_m ?? 0,
            data.supuracion_c ?? 0,
            data.supuracion_d ?? 0,

            data.placa_m ?? 0,
            data.placa_c ?? 0,
            data.placa_d ?? 0,

            data.implante || 0,
            data.movilidad ?? null,
            data.furca ?? null,
            data.pronostico_individual || null,
            data.encia_queratinizada ?? null,
            data.nota || null
        ]);

        return result.insertId;
    },

    async updateDetalle(detalleId, data) {

        const sql = `
    UPDATE periodontograma_detalles
    SET
      ausente = ?,
      margen_m = ?, margen_c = ?, margen_d = ?,
      sondaje_m = ?, sondaje_c = ?, sondaje_d = ?,
      sangrado_m = ?, sangrado_c = ?, sangrado_d = ?,
      supuracion_m = ?, supuracion_c = ?, supuracion_d = ?,
      placa_m = ?, placa_c = ?, placa_d = ?,
      implante = ?,
      movilidad = ?,
      furca = ?,
      pronostico_individual = ?,
      encia_queratinizada = ?,
      nota = ?
    WHERE id_detalle = ?
    `;

        await db.query(sql, [
            data.ausente ?? 0,

            data.margen_m,
            data.margen_c,
            data.margen_d,

            data.sondaje_m,
            data.sondaje_c,
            data.sondaje_d,

            data.sangrado_m ?? 0,
            data.sangrado_c ?? 0,
            data.sangrado_d ?? 0,

            data.supuracion_m ?? 0,
            data.supuracion_c ?? 0,
            data.supuracion_d ?? 0,

            data.placa_m ?? 0,
            data.placa_c ?? 0,
            data.placa_d ?? 0,

            data.implante ?? 0,
            data.movilidad ?? null,
            data.furca ?? null,
            data.pronostico_individual || null,
            data.encia_queratinizada ?? null,
            data.nota || null,

            detalleId
        ]);
    },

    async getDetalles(id_periodontograma) {

        const [rows] = await db.query(
            `SELECT * FROM periodontograma_detalles
       WHERE id_periodontograma = ?
       ORDER BY numero_diente, cara`,
            [id_periodontograma]
        );

        return rows;
    },

    /**
     * Bulk save: INSERT ... ON DUPLICATE KEY UPDATE
     * Usa el unique constraint (id_periodontograma, numero_diente, cara)
     */
    async bulkSaveDetalles(id_periodontograma, detalles) {
        if (!detalles || detalles.length === 0) return;

        const sql = `
    INSERT INTO periodontograma_detalles
    (
      id_periodontograma,
      numero_diente,
      ausente,
      cara,
      margen_m, margen_c, margen_d,
      sondaje_m, sondaje_c, sondaje_d,
      sangrado_m, sangrado_c, sangrado_d,
      supuracion_m, supuracion_c, supuracion_d,
      placa_m, placa_c, placa_d,
      implante,
      movilidad,
      furca,
      pronostico_individual,
      encia_queratinizada,
      nota
    )
    VALUES ?
    ON DUPLICATE KEY UPDATE
      ausente = VALUES(ausente),
      margen_m = VALUES(margen_m),
      margen_c = VALUES(margen_c),
      margen_d = VALUES(margen_d),
      sondaje_m = VALUES(sondaje_m),
      sondaje_c = VALUES(sondaje_c),
      sondaje_d = VALUES(sondaje_d),
      sangrado_m = VALUES(sangrado_m),
      sangrado_c = VALUES(sangrado_c),
      sangrado_d = VALUES(sangrado_d),
      supuracion_m = VALUES(supuracion_m),
      supuracion_c = VALUES(supuracion_c),
      supuracion_d = VALUES(supuracion_d),
      placa_m = VALUES(placa_m),
      placa_c = VALUES(placa_c),
      placa_d = VALUES(placa_d),
      implante = VALUES(implante),
      movilidad = VALUES(movilidad),
      furca = VALUES(furca),
      pronostico_individual = VALUES(pronostico_individual),
      encia_queratinizada = VALUES(encia_queratinizada),
      nota = VALUES(nota)
    `;

        const values = detalles.map(d => [
            id_periodontograma,
            d.numero_diente,
            d.ausente || 0,
            d.cara,
            d.margen_m ?? null,
            d.margen_c ?? null,
            d.margen_d ?? null,
            d.sondaje_m ?? null,
            d.sondaje_c ?? null,
            d.sondaje_d ?? null,
            d.sangrado_m ?? 0,
            d.sangrado_c ?? 0,
            d.sangrado_d ?? 0,
            d.supuracion_m ?? 0,
            d.supuracion_c ?? 0,
            d.supuracion_d ?? 0,
            d.placa_m ?? 0,
            d.placa_c ?? 0,
            d.placa_d ?? 0,
            d.implante || 0,
            d.movilidad ?? null,
            d.furca ?? null,
            d.pronostico_individual || null,
            d.encia_queratinizada ?? null,
            d.nota || null
        ]);

        await db.query(sql, [values]);
    },

    /**
     * Estadísticas calculadas igual que SEPA:
     * - Media profundidad de sondaje
     * - Media nivel de inserción (margen + sondaje)
     * - % Placa
     * - % Sangrado al sondaje
     */
    async getEstadisticas(id_periodontograma) {
        const sql = `
    SELECT
      -- Media de profundidad de sondaje (todos los sitios)
      AVG(all_ps) AS media_profundidad_sondaje,

      -- Media de nivel de inserción (margen + sondaje)
      AVG(all_ni) AS media_nivel_insercion,

      -- % Placa: sitios con placa > 0 / total sitios * 100
      (SUM(CASE WHEN all_placa > 0 THEN 1 ELSE 0 END) / COUNT(all_placa)) * 100 AS porcentaje_placa,

      -- % Sangrado: sitios con sangrado > 0 / total sitios * 100
      (SUM(CASE WHEN all_sangrado > 0 THEN 1 ELSE 0 END) / COUNT(all_sangrado)) * 100 AS porcentaje_sangrado,

      -- Totales
      COUNT(DISTINCT CONCAT(numero_diente, '-', cara)) AS total_registros

    FROM (
      SELECT
        numero_diente,
        cara,
        sondaje_m AS all_ps, placa_m AS all_placa, sangrado_m AS all_sangrado,
        COALESCE(margen_m, 0) + COALESCE(sondaje_m, 0) AS all_ni
      FROM periodontograma_detalles
      WHERE id_periodontograma = ? AND ausente = 0

      UNION ALL

      SELECT
        numero_diente,
        cara,
        sondaje_c, placa_c, sangrado_c,
        COALESCE(margen_c, 0) + COALESCE(sondaje_c, 0)
      FROM periodontograma_detalles
      WHERE id_periodontograma = ? AND ausente = 0

      UNION ALL

      SELECT
        numero_diente,
        cara,
        sondaje_d, placa_d, sangrado_d,
        COALESCE(margen_d, 0) + COALESCE(sondaje_d, 0)
      FROM periodontograma_detalles
      WHERE id_periodontograma = ? AND ausente = 0
    ) AS sitios
    WHERE all_ps IS NOT NULL
    `;

        const [rows] = await db.query(sql, [
            id_periodontograma,
            id_periodontograma,
            id_periodontograma
        ]);

        return rows[0] || {
            media_profundidad_sondaje: null,
            media_nivel_insercion: null,
            porcentaje_placa: null,
            porcentaje_sangrado: null,
            total_registros: 0
        };
    }

};

module.exports = PeriodontogramaModel;