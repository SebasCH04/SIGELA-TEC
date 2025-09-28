const express = require("express");
const sql = require("mssql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

const cfg = {
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  server: process.env.SQLSERVER_SERVER,      // 127.0.0.1
  port: Number(process.env.SQLSERVER_PORT),  // 1433
  database: process.env.SQLSERVER_DB,
  options: {
    encrypt: false,               // local
    trustServerCertificate: true, // local/dev
  },
};

let pool;
async function getPool() {
  if (!pool) pool = await sql.connect(cfg);
  return pool;
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/labs", async (_req, res) => {
  try {
    const p = await getPool();
    // PRUEBA: si solo la conexión funciona, esto devuelve 1 fila
    // const test = await p.request().query("SELECT 1 AS ok");
    // return res.json(test.recordset);

    const { recordset } = await p.request()
      .query("SELECT TOP 50 * FROM Labs ORDER BY id");
    res.json(recordset);
  } catch (e) {
    // log detallado a consola
    console.error("DB ERROR:", {
      code: e?.code,
      message: e?.message,
      number: e?.originalError?.info?.number,
      state: e?.originalError?.info?.state,
      lineNumber: e?.originalError?.info?.lineNumber,
      serverName: e?.originalError?.info?.serverName,
      name: e?.name,
    });
    // devolver detalle solo en dev
    res.status(500).json({ error: e.message, code: e.code });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`API on http://localhost:${process.env.PORT || 3000}`)
);
