const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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
const JWT_SECRET = process.env.JWT_SECRET || "123456789abcdef";
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
    if (code === 1) return res.status(401).json({ error: "Usuario o rol incorrecto" });
    if (code === 2) return res.status(403).json({ error: "Usuario inactivo" });

    const row = r.recordset?.[0];
    if (!row) return res.status(500).json({ error: "Server error" });

    // Verifica la contraseña (ahora sí)
    // Si usas hashing (bcrypt), reemplaza esta comparación por bcrypt.compare(password, row.password)
    if (String(row.password) !== String(password)) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // No enviar la contraseña al cliente
    const userSafe = { id: row.id, username: row.username, role: row.role, active: row.active };

    const token = signToken({ id: row.id, username: row.username, role: row.role });
    setCookie(res, token);
    res.json({ user: userSafe });
  } catch (e) {
    console.error("LOGIN ERROR:", {
      message: e?.message,
      code: e?.code,
      info: e?.originalError?.info,
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

// GET /api/labs?q=
app.get('/api/labs', requireAuth, async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request()
      .input('q', sql.NVarChar(100), req.query.q ?? null)
      .execute('dbo.usp_Labs_List');
    res.json(r.recordset || []);
  } catch (e) {
    console.error('LABS ERROR:', e);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/resources/search?q=&labId=&from=&to=
app.get('/api/resources/search', requireAuth, async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request()
      .input('q',     sql.NVarChar(100), req.query.q ?? null)
      .input('lab_id',sql.Int,           req.query.labId ? Number(req.query.labId) : null)
      .input('from',  sql.DateTime2,     req.query.from ?? null)
      .input('to',    sql.DateTime2,     req.query.to ?? null)
      .execute('sigela.usp_Resources_Search');
    res.json(r.recordset || []);
  } catch (e) {
    console.error('RES SEARCH ERROR:', e);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/me/upcoming
app.get("/api/me/upcoming", requireAuth, async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request()
      .input("user_id", sql.Int, req.user.id)
      .input("top",     sql.Int, 5)
      .execute("sigela.usp_Reservations_UpcomingByUser");
    res.json(r.recordset || []);
  } catch (e) {
    console.error("UPCOMING ERROR:", e);
    res.status(500).json({ error: 'DB error' });
  }
});

// GET /api/me/history
app.get("/api/me/history", requireAuth, async (req, res) => {
  try {
    const p = await getPool();
    const r = await p.request()
      .input("userId", sql.Int, req.user.id)
      .input("from",   sql.DateTime2, req.query.from ?? null)
      .input("to",     sql.DateTime2, req.query.to   ?? null)
      .execute("HistoryByUser");

    return res.json(r.recordset || []);
  } catch (e) {
    console.error("GET /api/me/history error:", e?.message || e);
    return res.status(500).json({ error: "Error al obtener historial" });
  }
});


app.get("/api/me/notifications", requireAuth, async (req, res) => {
  try {
    const onlyUnread = String(req.query.unread ?? "0") === "1";
    const top = Number(req.query.top ?? 20);
    const p = await getPool();
    const r = await p.request()
      .input("user_id", sql.Int, req.user.id)
      .input("only_unread", sql.Bit, onlyUnread ? 1 : 0)
      .input("top", sql.Int, top)
      .execute("dbo.Notifications_ListByUser");
    res.json(r.recordset || []);
  } catch (e) {
    console.error("NOTIF LIST ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
});


app.post("/api/me/notifications/mark-read", requireAuth, async (req, res) => {
  try {
    const { id = null, all = false } = req.body || {};
    const p = await getPool();
    const r = await p.request()
      .input("user_id", sql.Int, req.user.id)
      .input("id", sql.Int, id)
      .input("all", sql.Bit, all ? 1 : 0)
      .execute("dbo.Notifications_MarkRead");
    res.json(r.recordset?.[0] || { unread: 0 });
  } catch (e) {
    console.error("NOTIF MARK READ ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
});


app.post("/api/me/notifications", requireAuth, async (req, res) => {
  try {
    const { title, message, kind = "INFO" } = req.body || {};
    const p = await getPool();
    const r = await p.request()
      .input("user_id", sql.Int, req.user.id)
      .input("title", sql.NVarChar(150), title)
      .input("message", sql.NVarChar(1000), message)
      .input("kind", sql.NVarChar(20), kind)
      .execute("dbo.Notifications_Create");
    res.json({ id: r.recordset?.[0]?.new_id });
  } catch (e) {
    console.error("NOTIF CREATE ERROR:", e);
    res.status(500).json({ error: "DB error" });
  }
});


app.post("/api/reservations/:id/deliver", requireAuth, async (req, res) => {
  try {
    const reservationId = Number(req.params.id);
    const userId = req.user.id;
    // opcional: verificar rol
    const allowed = ["tecnico", "encargado", "administrador"];
    if (!allowed.includes(String(req.user.role).toLowerCase())) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const p = await getPool();
    const r = await p.request()
      .input("reservation_id", sql.Int, reservationId)
      .input("delivered_by", sql.Int, userId)
      .execute("dbo.Reservation_Deliver");

    return res.json({ ok: true, result: r.recordset?.[0] || null });
  } catch (e) {
    console.error("RES DELIVER ERROR:", e.message || e);
    return res.status(500).json({ error: "DB error" });
  }
});

app.post("/api/reservations/:id/return", requireAuth, async (req, res) => {
  try {
    const reservationId = Number(req.params.id);
    const userId = req.user.id;
    const allowed = ["tecnico", "encargado", "administrador"];
    if (!allowed.includes(String(req.user.role).toLowerCase())) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const p = await getPool();
    const r = await p.request()
      .input("reservation_id", sql.Int, reservationId)
      .input("returned_by", sql.Int, userId)
      .execute("dbo.Reservation_Return");

    return res.json({ ok: true, result: r.recordset?.[0] || null });
  } catch (e) {
    console.error("RES RETURN ERROR:", e.message || e);
    return res.status(500).json({ error: "DB error" });
  }
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

