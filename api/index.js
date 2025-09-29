const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const cookieParser = require("cookie-parser");   // <-- agrega esto
const jwt = require("jsonwebtoken"); 
require("dotenv").config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(cookieParser()); 

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

const COOKIE = "sigela_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

function signToken(payload){
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}
function setCookie(res, token){
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // en prod detrás de HTTPS => true
    maxAge: 7*24*60*60*1000
  });
}
function requireAuth(req, res, next){
  try{
    const t = req.cookies[COOKIE];
    if(!t) return res.status(401).json({ error: "No session" });
    req.user = jwt.verify(t, JWT_SECRET);
    next();
  }catch{ return res.status(401).json({ error: "Invalid session" }); }
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// LOGIN por SP (sin hash)
app.post("/api/auth/login", async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  try {
    const p = await getPool();
    const r = await p.request()
      .input("username", sql.NVarChar(50), username)
      .input("role",     sql.NVarChar(20), role || null)
      .output("rcode",   sql.Int)
      .execute("Auth_GetUserByUsernameRole");

    const code = r.output.rcode;
    if (code === 1) return res.status(401).json({ error: "Usuario o rol inválido" });
    if (code === 2) return res.status(403).json({ error: "Usuario inactivo" });
    if (code === 3) return res.status(401).json({ error: "Contraseña incorrecta" });

    const user = r.recordset?.[0];
    if (!user) return res.status(500).json({ error: "Server error" });

    const token = signToken({ id: user.id, username: user.username, role: user.role });
    setCookie(res, token);
    res.json({ user });
} catch (e) {
  console.error("LOGIN ERROR:", {
    message: e?.message,
    code: e?.code,
    info: e?.originalError?.info, // número/estado/objeto en SQL Server
  });
  return res.status(500).json({
    error: e?.message,
    info: e?.originalError?.info || null,
  });
}
});


app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request()
      .input("id", sql.Int, req.user.id)   // <- id viene del JWT
      .output("rcode", sql.Int)
      .execute("GetUserById");

    if (r.output.rcode !== 0 || !r.recordset?.[0]) {
      return res.status(404).json({ error: "Not found" });
    }

    const u = r.recordset[0];
    // devuelves solo campos seguros
    return res.json({ user: { id: u.id, username: u.username, role: u.role, active: u.active } });
  } catch (e) {
    console.error("ME ERROR:", e.message, e.originalError?.info || "");
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE, { httpOnly: true, sameSite: "lax", secure: false });
  res.json({ ok: true });
});






const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API on http://localhost:${PORT}`);
});

// => loguea cualquier problema al arrancar o al cerrar
server.on("error", (err) => {
  console.error("Server error (listen):", err);
});
server.on("close", () => {
  console.log("Server closed");
});

// => NO dejes que errores no manejados te tumben el proceso sin mensaje
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
});

