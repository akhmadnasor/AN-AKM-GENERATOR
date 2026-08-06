import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

export default function Admin() {
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.getAdminData();
      setData(res);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (!data) return <div>Memuat...</div>;

  return (
    <section className="page-section">
      <div className="admin-heading">
        <div>
          <span className="eyebrow dark">ADMINISTRATOR</span>
          <h1>Pengelolaan Aplikasi</h1>
        </div>
        <button className="btn btn-secondary" onClick={loadData}>↻ Muat Ulang</button>
      </div>

      <div className="admin-stats">
        <article><span>Pengguna</span><strong>{data.users.length}</strong><small>Total akun</small></article>
        <article><span>Aktif</span><strong>{data.users.filter((u:any) => u.status === 'Aktif').length}</strong><small>Dapat masuk</small></article>
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
    </section>
  );
}
