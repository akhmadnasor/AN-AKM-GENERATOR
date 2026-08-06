import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- In-Memory Database ---
const users = [
  {
    id: "USR-admin",
    name: "Administrator",
    username: "admin",
    password: "admin123",
    role: "admin",
    status: "Aktif",
    passwordStatus: "Sudah diubah",
    createdAt: new Date().toISOString(),
  },
];

const subjects = [
  { id: "MAP-SD-01", level: "SD/MI", name: "Bahasa Indonesia", status: "Aktif", order: 1 },
  { id: "MAP-SD-02", level: "SD/MI", name: "Matematika", status: "Aktif", order: 2 },
  { id: "MAP-SD-03", level: "SD/MI", name: "IPAS", status: "Aktif", order: 3 },
  { id: "MAP-SMP-01", level: "SMP/MTs", name: "Bahasa Indonesia", status: "Aktif", order: 1 },
  { id: "MAP-SMP-02", level: "SMP/MTs", name: "Matematika", status: "Aktif", order: 2 },
];

let settings = {
  appName: "AN/AKM Soal Generator",
  tagline: "Soal Bermutu, Pembelajaran Maju",
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lambang_Kabupaten_Pasuruan.png",
  primaryColor: "#1259C3",
  secondaryColor: "#3B82F6",
  footerText: "AN/AKM Soal Generator",
  maxQuestions: 100,
  version: "5.3.0",
};

// --- API Routes ---

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Username atau password tidak sesuai." });
  }
  if (user.status !== "Aktif") {
    return res.status(403).json({ error: "Akun ini telah dinonaktifkan." });
  }

  res.json({
    token: user.id,
    user: { id: user.id, name: user.name, username: user.username, role: user.role },
    requirePasswordChange: user.passwordStatus === "Awal",
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, username, password } = req.body;
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return res.status(400).json({ error: "Username sudah digunakan." });
  }

  const newUser = {
    id: `USR-${Date.now()}`,
    name,
    username,
    password,
    role: "user",
    status: "Aktif",
    passwordStatus: "Sudah diubah",
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);

  res.json({ message: "Pendaftaran berhasil. Silakan masuk." });
});

app.post("/api/auth/change-password", (req, res) => {
  const { token, currentPassword, newPassword } = req.body;
  const user = users.find((u) => u.id === token);
  if (!user || user.password !== currentPassword) {
    return res.status(401).json({ error: "Password saat ini tidak sesuai." });
  }
  user.password = newPassword;
  user.passwordStatus = "Sudah diubah";
  res.json({ message: "Password berhasil diubah." });
});

app.get("/api/bootstrap", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const user = users.find((u) => u.id === token);
  
  if (!user) {
    return res.status(401).json({ error: "Sesi tidak valid." });
  }

  res.json({
    user: { id: user.id, name: user.name, username: user.username, role: user.role },
    settings,
    subjects: subjects.filter((s) => s.status === "Aktif"),
  });
});

app.get("/api/admin/data", (req, res) => {
  res.json({
    users: users.map(u => ({
      id: u.id, name: u.name, username: u.username, role: u.role,
      status: u.status, passwordStatus: u.passwordStatus, createdAt: u.createdAt
    })),
    settings,
    subjects,
  });
});

// --- Vite Middleware & Static Serving ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
