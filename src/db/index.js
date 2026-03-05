const { drizzle } = require("drizzle-orm/mysql2");
const poolConnection = require("../config/db");
const schema = require("./schema");

// Se exporta la instancia de Drizzle usando el pool existente
const db = drizzle(poolConnection, { schema, mode: "default" });

module.exports = db;
