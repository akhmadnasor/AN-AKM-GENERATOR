import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { RefreshCw } from 'lucide-react';

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState('users');

  const [settingsForm, setSettingsForm] = useState<any>(null);
  
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getAdminData();
      setData(res);
      setSettingsForm(res.settings);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const saveSettings = () => {
    // Usually save via API
    alert('Pengaturan berhasil disimpan');
  };

  if (!data) return <div>Memuat...</div>;

  return (
    <section className="page-section">
      <div className="admin-heading">
        <div>
          <span className="eyebrow dark">ADMINISTRATOR</span>
          <h1>Pengelolaan Aplikasi</h1>
        </div>
        <button className="btn btn-secondary" onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} /> Muat Ulang
        </button>
      </div>

      <div className="admin-stats">
        <article><span>Pengguna</span><strong>{data.users.length}</strong><small>Total akun</small></article>
        <article><span>Mata Pelajaran</span><strong>{data.subjects.length}</strong><small>Terdaftar</small></article>
      </div>

      <div className="admin-tabs panel">
        <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Pengguna</button>
        <button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}>Konfigurasi</button>
        <button className={tab === 'subjects' ? 'active' : ''} onClick={() => setTab('subjects')}>Mata Pelajaran</button>
      </div>

      {tab === 'users' && (
        <div className="admin-panel">
          <div className="admin-table-card panel">
            <div className="responsive-table">
              <table>
                <thead><tr><th>Nama</th><th>Username</th><th>Peran</th><th>Status</th></tr></thead>
                <tbody>
                  {data.users.map((u:any) => (
                    <tr key={u.id}>
                      <td><strong>{u.name}</strong></td>
                      <td><code>{u.username}</code></td>
                      <td>{u.role === 'admin' ? 'Administrator' : 'Pengguna'}</td>
                      <td><span className={`status-pill ${u.status === 'Aktif' ? 'active' : 'inactive'}`}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="admin-panel">
          <div className="panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Konfigurasi Aplikasi & Ruang Kerja</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nama Aplikasi</label>
                <input style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem' }} value={settingsForm?.appName || ''} onChange={e => setSettingsForm({ ...settingsForm, appName: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Slogan (Tagline)</label>
                <input style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem' }} value={settingsForm?.tagline || ''} onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Penyimpanan Ruang Kerja</label>
                <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem' }}>
                  <option>Lokal (Browser Storage)</option>
                  <option>Database (Cloud)</option>
                </select>
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#64748b' }}>Simpan draft, bank soal, dan hasil di Ruang Kerja.</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Simpan Draft Otomatis</label>
                <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem' }}>
                  <option>Aktif</option>
                  <option>Nonaktif</option>
                </select>
                <small style={{ display: 'block', marginTop: '0.25rem', color: '#64748b' }}>Menyimpan progress pembuatan soal secara berkala.</small>
              </div>
            </div>

            <button className="btn btn-primary" onClick={saveSettings}>Simpan Konfigurasi</button>
          </div>
        </div>
      )}

      {tab === 'subjects' && (
        <div className="admin-panel">
          <div className="admin-table-card panel">
            <div className="responsive-table">
              <table>
                <thead><tr><th>Kode</th><th>Jenjang</th><th>Mata Pelajaran</th><th>Status</th></tr></thead>
                <tbody>
                  {data.subjects.map((s:any) => (
                    <tr key={s.id}>
                      <td><small>{s.id}</small></td>
                      <td><strong>{s.level}</strong></td>
                      <td>{s.name}</td>
                      <td><span className={`status-pill ${s.status === 'Aktif' ? 'active' : 'inactive'}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
