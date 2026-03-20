const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/yessi/Downloads/ESTADIA/asistDental-B/.env' });

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  try {
    const [rows] = await connection.query('DESCRIBE catalogo_diagnosticos');
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

check();
