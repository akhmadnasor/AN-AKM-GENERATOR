import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://noucigpwwodytsbkezwz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdWNpZ3B3d29keXRzYmtlend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MDk0MTUsImV4cCI6MjEwMTA4NTQxNX0.MXmqs-Xtj7kRUtP2zN-ZQ_rs2se5J4cF6fVO2B3r2yI";
const supabase = createClient(supabaseUrl, supabaseKey);

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

export const api = {
  async login(credentials: any) {
    const { username, password } = credentials;
    const { data: user, error } = await supabase
      .from('guru')
      .select('*')
      .ilike('username', username)
      .eq('password', password)
      .maybeSingle();

    if (error || !user) throw new Error("Username atau password tidak sesuai.");
    if (user.status && user.status !== "Aktif") throw new Error("Akun ini telah dinonaktifkan.");

    return {
      token: user.id,
      user: { 
        id: user.id, 
        name: user.name || user.nama, 
        username: user.username, 
        role: user.role || 'user' 
      },
      requirePasswordChange: user.passwordStatus === "Awal",
    };
  },

  async register(userData: any) {
    const { name, username, password } = userData;
    const { data: existingUser } = await supabase
      .from('guru')
      .select('id')
      .ilike('username', username)
      .maybeSingle();

    if (existingUser) throw new Error("Username sudah digunakan.");

    const { error } = await supabase.from('guru').insert([{
      nama: name,
      name: name,
      username,
      password,
      role: "user",
      status: "Aktif",
      passwordStatus: "Sudah diubah",
      createdAt: new Date().toISOString()
    }]);

    if (error) throw new Error("Gagal mendaftar pengguna baru.");
    return { message: "Pendaftaran berhasil. Silakan masuk." };
  },

  async getBootstrap() {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Sesi tidak valid.");

    const { data: user, error } = await supabase
      .from('guru')
      .select('*')
      .eq('id', token)
      .maybeSingle();

    if (error || !user) throw new Error("Sesi tidak valid.");

    return {
      user: { 
        id: user.id, 
        name: user.name || user.nama, 
        username: user.username, 
        role: user.role || 'user' 
      },
      settings,
      subjects: subjects.filter((s) => s.status === "Aktif"),
    };
  },

  async getAdminData() {
    const { data: users, error } = await supabase.from('guru').select('*');
    if (error) throw new Error("Gagal mengambil data.");

    return {
      users: (users || []).map((u: any) => ({
        id: u.id,
        name: u.name || u.nama,
        username: u.username,
        role: u.role || 'user',
        status: u.status || 'Aktif',
        passwordStatus: u.passwordStatus || 'Sudah diubah',
        createdAt: u.createdAt || u.created_at || new Date().toISOString()
      })),
      settings,
      subjects,
    };
  }
};
