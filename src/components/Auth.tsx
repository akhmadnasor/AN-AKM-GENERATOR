import React, { useState } from 'react';
import { api } from '../lib/api';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Brain, 
  BarChart3, 
  Book, 
  Pencil, 
  ClipboardList, 
  Shield, 
  FileText, 
  BookOpen, 
  Calculator, 
  Download, 
  Lock, 
  BookMarked, 
  TrendingUp 
} from 'lucide-react';

export default function Auth({ onLogin, settings }: { onLogin: (data: any) => void, settings: any }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await api.login({ username, password });
        onLogin(data);
      } else {
        await api.register({ name, username, password });
        alert('Pendaftaran berhasil. Silakan masuk.');
        setMode('login');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <img src="https://lh3.googleusercontent.com/d/1FV7EmCnGHRbpQvbbdrRv-t0KZCUXbIqk" alt="Logo" style={{ width: 44, height: 44, borderRadius: 12, marginRight: 12, objectFit: "contain", background: "white", padding: 4 }} />
          <div>
            <strong>{settings?.appName || "AN/AKM Soal Generator"}</strong>
            <span>{settings?.tagline || "Soal Bermutu, Pembelajaran Maju"}</span>
          </div>
        </div>
        
        <div className="hero-copy">
          <span className="eyebrow">ASESMEN CERDAS UNTUK GURU</span>
          <h1>Susun Soal Bermutu<br/>Lebih Mudah</h1>
          <p>Buat soal reguler, literasi, dan numerasi sesuai CP serta tujuan pembelajaran.</p>
        </div>

        <div className="hero-illustration-wrapper">
          <img className="student-illustration" src="https://lh3.googleusercontent.com/d/1M-zvxIoDsD335GHk7FzzBJGSkGZrXuEu" alt="Ilustrasi siswa belajar" />
          
          <div className="floating-icon icon-ai"><Brain size={24} /></div>
          <div className="floating-icon icon-chart"><BarChart3 size={24} /></div>
          <div className="floating-icon icon-book"><Book size={24} /></div>
          <div className="floating-icon icon-pencil"><Pencil size={24} /></div>
          <div className="floating-icon icon-clipboard"><ClipboardList size={24} /></div>
          <div className="floating-icon icon-shield"><Shield size={24} /></div>
          
          <div className="orbit-ring ring-1"></div>
          <div className="orbit-ring ring-2"></div>
        </div>

        <div className="hero-features">
          <div className="feature-card">
            <div className="feat-icon"><FileText size={18} /></div>
            <div>
              <strong>Reguler</strong>
              <span>Soal pilihan ganda & uraian</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feat-icon"><BookOpen size={18} /></div>
            <div>
              <strong>Literasi</strong>
              <span>Teks informatif & naratif</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feat-icon"><Calculator size={18} /></div>
            <div>
              <strong>Numerasi</strong>
              <span>Kontekstual & logis</span>
            </div>
          </div>
          <div className="feature-card">
            <div className="feat-icon"><Download size={18} /></div>
            <div>
              <strong>Word & JSON</strong>
              <span>Ekspor mudah siap pakai</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrapper">
          <div className="auth-card">
            <div className="auth-tabs" role="tablist">
              <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Masuk</button>
              <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Daftar</button>
            </div>
            
            <div className="auth-icon-header">
              <img src="https://lh3.googleusercontent.com/d/1FV7EmCnGHRbpQvbbdrRv-t0KZCUXbIqk" alt="Logo" style={{ width: 48, height: 48, objectFit: "contain" }} />
            </div>
            
            <div className="flex flex-col items-center justify-center text-center w-full mb-6">
              <h2 className="glowing-text text-2xl sm:text-3xl font-bold mb-2 tracking-tight">{mode === 'login' ? 'Selamat Datang' : 'Buat Akun'}</h2>
              <p className="text-sm sm:text-base text-slate-500 max-w-sm">{mode === 'login' ? 'Masuk untuk mulai menyusun soal.' : 'Hanya nama pengguna yang menjadi data profil.'}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === 'register' && (
                <label>Nama pengguna
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Akhmad Nasor" required />
                </label>
              )}
              <label>Username
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Masukkan username" required autoComplete="username" />
              </label>
              <label>Kata Sandi
                <div className="password-wrap">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Masukkan kata sandi" autoComplete={mode === "login" ? "current-password" : "new-password"} 
                    required 
                  />
                  <button type="button" className="password-toggle flex items-center justify-center" onClick={() => setShowPassword(!showPassword)} aria-label="Tampilkan sandi">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
              
              {mode === 'login' && (
                <div className="auth-options">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    Ingat saya
                  </label>
                  <a href="#" className="forgot-link">Lupa kata sandi?</a>
                </div>
              )}

              <button className="btn btn-primary btn-block btn-lg mt-2" type="submit" disabled={loading}>
                {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk ke Aplikasi' : 'Daftar Akun')}
              </button>
              
              <p className="auth-switch">
                {mode === 'login' ? 'Belum mempunyai akun? ' : 'Sudah mempunyai akun? '}
                <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
                </button>
              </p>
            </form>
          </div>

          <div className="auth-benefits">
            <div className="benefit-item">
              <Lock size={16} />
              <span><strong>Aman & Terpercaya</strong>Data terenkripsi</span>
            </div>
            <div className="benefit-item">
              <BookMarked size={16} />
              <span><strong>Mendukung Kurikulum</strong>Sesuai CP terbaru</span>
            </div>
            <div className="benefit-item">
              <TrendingUp size={16} />
              <span><strong>Meningkatkan Kualitas</strong>Asesmen lebih efektif</span>
            </div>
          </div>
          
          <p className="auth-footer">© {new Date().getFullYear()} akhmad nasor • Versi Pro</p>
        </div>
      </section>
    </main>
  );
}
