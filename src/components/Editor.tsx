import React from 'react';
import { exportToDocx } from '../lib/exportDocx';

export default function Editor({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="simple-page panel">
        <span className="simple-icon">W</span>
        <h1>Editor Hasil</h1>
        <p>Belum ada data soal. Silakan selesaikan konfigurasi di menu Buat Soal terlebih dahulu.</p>
      </div>
    );
  }

  const downloadJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soal_${data?.identitas?.mata_pelajaran || 'akm'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDocx = async () => {
    await exportToDocx(data);
  };

  return (
    <section className="page-section">
      <div className="admin-heading">
        <div>
          <span className="eyebrow dark">HASIL SOAL</span>
          <h1>Pratinjau Asesmen</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={downloadJson}>↓ Unduh JSON</button>
          <button className="btn btn-primary" onClick={downloadDocx}>W Unduh Word</button>
        </div>
      </div>
      
      <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Identitas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
            <div><strong>Mata Pelajaran:</strong> {data?.identitas?.mata_pelajaran}</div>
            <div><strong>Fase/Kelas:</strong> {data?.identitas?.fase} / Kelas {data?.identitas?.kelas}</div>
            <div><strong>Topik:</strong> {data?.identitas?.topik}</div>
            <div><strong>Total Soal:</strong> {data?.konfigurasi?.jumlah_total}</div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Daftar Soal</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(data?.soal || []).map((s: any, idx: number) => (
              <div key={idx} style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <strong style={{ fontSize: '1.125rem' }}>Soal {s.nomor}</strong>
                  <span className="local-badge" style={{ textTransform: 'capitalize' }}>{s.bentuk_soal.replace(/_/g, ' ')}</span>
                </div>
                <p style={{ marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{s.pokok_soal}</p>
                {s.pilihan_jawaban && s.pilihan_jawaban.length > 0 && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {s.pilihan_jawaban.map((p: any, pidx: number) => (
                      <li key={pidx} style={{ display: 'flex', gap: '0.5rem' }}>
                        <strong>{p.kode || p.kiri || String.fromCharCode(65+pidx)}.</strong> {p.teks || p.kanan || p.teks}
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e0f2fe', borderRadius: '0.25rem' }}>
                  <strong>Kunci Jawaban:</strong> {Array.isArray(s.kunci_jawaban) ? s.kunci_jawaban.join(', ') : s.kunci_jawaban}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
