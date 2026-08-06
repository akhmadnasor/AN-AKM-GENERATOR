import React, { useState } from 'react';
import { api } from '../lib/api';

export default function Auth({ onLogin, settings }: { onLogin: (data: any) => void, settings: any }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
          <img src={settings?.logoUrl || "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lambang_Kabupaten_Pasuruan.png"} alt="Logo" className="brand-logo" />
          <div>
            <strong>{settings?.appName || "AN/AKM Soal Generator"}</strong>
            <span>{settings?.tagline || "Soal Bermutu, Pembelajaran Maju"}</span>
          </div>
        </div>
        <div className="hero-copy">
          <span className="eyebrow">ASESMEN CERDAS UNTUK GURU</span>
          <h1>Susun Soal Bermutu <em>Lebih Mudah</em></h1>
          <p>Buat soal reguler, literasi, dan numerasi sesuai CP serta tujuan pembelajaran.</p>
        </div>
        <img className="student-illustration" src="https://lh3.googleusercontent.com/d/1M-zvxIoDsD335GHk7FzzBJGSkGZrXuEu" alt="Ilustrasi siswa belajar" />
        <div className="feature-pills" style={{ marginTop: '2rem' }}>
          <span>✓ Reguler</span><span>✓ Literasi</span><span>✓ Numerasi</span><span>✓ Word & JSON</span>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <div className="mobile-brand">
            <img src={settings?.logoUrl || "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lambang_Kabupaten_Pasuruan.png"} alt="Logo" />
            <div><strong>AN/AKM</strong><span>Soal Generator</span></div>
          </div>
          <div className="auth-tabs" role="tablist">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Masuk</button>
            <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Daftar</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <span className="icon-chip">{mode === 'login' ? '↗' : '＋'}</span>
              <div>
                <h2>{mode === 'login' ? 'Selamat Datang' : 'Buat Akun'}</h2>
                <p>{mode === 'login' ? 'Masuk untuk mulai menyusun soal.' : 'Hanya nama pengguna yang menjadi data profil.'}</p>
              </div>
            </div>
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
                  type="text" 
                  style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Masukkan kata sandi" 
                  required 
                />
                <button type="button" className="password-toggle flex items-center justify-center" onClick={() => setShowPassword(!showPassword)} aria-label="Tampilkan sandi">
                  {showPassword ? <span style={{fontSize: '18px'}}>👁️‍🗨️</span> : <span style={{fontSize: '18px'}}>👁️</span>}
                </button>
              </div>
            </label>
            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              <span>{loading ? 'Memproses...' : (mode === 'login' ? 'Masuk ke Aplikasi' : 'Daftar Akun')}</span><b>→</b>
            </button>
            <p className="auth-switch">
              {mode === 'login' ? 'Belum mempunyai akun? ' : 'Sudah mempunyai akun? '}
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
              </button>
            </p>
          </form>
        </div>
        <p className="auth-footer">© {new Date().getFullYear()} akhmad nasor • Versi 5.3.0</p>
      </section>
    </main>
  );
}
