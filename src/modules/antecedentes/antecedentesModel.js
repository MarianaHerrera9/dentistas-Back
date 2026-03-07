const db = require('../../db/index');
const { eq } = require('drizzle-orm');
const { antecedentes, tipoAntecedente } = require('../../db/schema');

const Antecedentes = {

    async create(data) {
        if (!data.id_paciente) throw new Error('id_paciente es obligatorio');
        if (!data.id_tipo_antecedente) throw new Error('id_tipo_antecedente es obligatorio');

        const [result] = await db.insert(antecedentes).values({
            idPaciente: data.id_paciente,
            idTipoAntecedente: data.id_tipo_antecedente
        });

        return result.insertId;
    },

    async getByPaciente(id_paciente) {
        const result = await db
            .select({
                id_antecedente: antecedentes.idAntecedente,
                id_paciente: antecedentes.idPaciente,
                id_tipo_antecedente: antecedentes.idTipoAntecedente,
                fecha_registro: antecedentes.fechaRegistro,
                nombre: tipoAntecedente.nombre
            })
            .from(antecedentes)
            .innerJoin(tipoAntecedente, eq(tipoAntecedente.idTipo, antecedentes.idTipoAntecedente))
            .where(eq(antecedentes.idPaciente, id_paciente));

        return result;
    }
};

module.exports = Antecedentes;
