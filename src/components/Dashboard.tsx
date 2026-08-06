import React, { useState, useEffect } from 'react';

export default function Dashboard({ user, onNavigate }: { user: any, onNavigate: (s: string) => void }) {
  const firstName = user?.name?.split(' ')[0] || 'Pengguna';
  const [hasDraft, setHasDraft] = useState(false);
  const [draftInfo, setDraftInfo] = useState<any>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wizardDraft');
      if (saved) {
        const parsed = JSON.parse(saved);
        setHasDraft(true);
        setDraftInfo(parsed);
      }
    } catch (e) {}
  }, []);

  return (
    <section className="page-section">
      <div className="welcome-card">
        <div>
          <span className="eyebrow dark">AN/AKM GENERATOR • VERSI 5.3.0</span>
          <h1>Selamat datang, <span>{firstName}</span>!</h1>
          <p>Susun asesmen reguler, literasi, dan numerasi yang terstruktur untuk SD/MI hingga SMP/MTs.</p>
          <button className="btn btn-light" onClick={() => onNavigate('wizard')}>Mulai Buat Soal <b>→</b></button>
        </div>
        <div className="welcome-visual">
          <div className="paper-card p1"><span>Literasi</span><b>A B C D</b></div>
          <div className="paper-card p2"><span>Numerasi</span><b>12 + 8</b></div>
          <div className="blue-orb">✓</div>
        </div>
      </div>

      <div className="quick-grid">
        <article><span className="quick-icon blue">R</span><div><b>Soal Reguler</b><p>Sesuai materi, CP, dan tujuan.</p></div></article>
        <article><span className="quick-icon violet">L</span><div><b>Literasi Membaca</b><p>Stimulus teks dan kognitif.</p></div></article>
        <article><span className="quick-icon amber">N</span><div><b>Numerasi</b><p>Data dan masalah kuantitatif.</p></div></article>
        <article><span className="quick-icon green">W</span><div><b>Word & JSON</b><p>Unduh naskah Word & JSON.</p></div></article>
      </div>

      <div className="dashboard-grid">
        <article className="panel getting-started">
          <div className="panel-head">
            <div><h3>Cara Membuat Soal</h3><p>Lima langkah terarah</p></div><span>5 langkah</span>
          </div>
          <ol>
            <li><b>1</b><div><strong>Isi Identitas</strong><span>Jenjang, kelas, mapel, materi.</span></div></li>
            <li><b>2</b><div><strong>Tentukan Pembelajaran</strong><span>CP, tujuan, indikator.</span></div></li>
            <li><b>3</b><div><strong>Atur Komposisi</strong><span>Jumlah kategori & bentuk.</span></div></li>
            <li><b>4</b><div><strong>Atur AKM & Level</strong><span>Stimulus, proses, Paket A/B.</span></div></li>
            <li><b>5</b><div><strong>Generate & Ekspor</strong><span>Edit, validasi, ekspor.</span></div></li>
          </ol>
        </article>
        <article className="panel draft-summary">
          <div className="panel-head">
            <div><h3>Draft Terakhir</h3><p>Disimpan di perangkat</p></div><span className="local-badge">Lokal</span>
          </div>
          {hasDraft && draftInfo ? (
            <div className="draft-active-state" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ display: 'block', fontSize: '1.125rem' }}>{draftInfo.identity?.subject || 'Mata Pelajaran Belum Dipilih'}</strong>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{draftInfo.identity?.level} - {draftInfo.identity?.phase} Kelas {draftInfo.identity?.grade}</span>
              </div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Materi: {draftInfo.identity?.topic || '-'}<br />
                Penyusun: {draftInfo.author?.name || '-'}
              </p>
              <button className="btn btn-secondary btn-small" onClick={() => onNavigate('wizard')}>Lanjutkan Draft <b>→</b></button>
            </div>
          ) : (
            <div className="empty-state">
              <span>▤</span><strong>Belum ada draft</strong><p>Isian wizard akan disimpan otomatis.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
