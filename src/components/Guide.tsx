import React from 'react';

export default function Guide({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <section className="page-section">
      <div className="admin-heading">
        <div>
          <span className="eyebrow dark">PANDUAN APLIKASI</span>
          <h1>Cara Membuat Soal AN/AKM</h1>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('wizard')}>Mulai Buat Soal</button>
      </div>

      <div className="panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
            Aplikasi ini membantu Anda menyusun soal Asesmen Nasional (AN) / Asesmen Kompetensi Minimum (AKM) dengan mudah menggunakan bantuan AI, menghasilkan draf instan yang dapat diekspor ke JSON atau Microsoft Word.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <article style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>1</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Isi Identitas & Materi</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Langkah pertama, lengkapi profil sekolah, pilih mata pelajaran, tentukan fase (SD/SMP), kelas, dan tuliskan topik atau materi yang ingin diujikan.
            </p>
          </article>

          <article style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>2</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Capaian & Tujuan</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Masukkan Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) sebagai acuan dasar agar soal selaras dengan kurikulum yang berlaku.
            </p>
          </article>

          <article style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>3</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Komposisi Soal</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Tentukan jumlah butir soal, pembagian proporsi (reguler, literasi, numerasi), bentuk soal (pilihan ganda, menjodohkan, isian, uraian), dan tingkat kesulitannya.
            </p>
          </article>

          <article style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>4</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Konfigurasi AKM</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Pilih mode paket, tentukan domain, proses kognitif, konteks, dan bentuk stimulus (teks, infografis, tabel, dll) untuk memandu pembuatan soal berbasis AKM.
            </p>
          </article>

          <article style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: '1 / -1', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>5</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Generate & Ekspor</h3>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Salin <i>Prompt</i> yang dihasilkan oleh aplikasi ke layanan AI eksternal (seperti ChatGPT, Gemini, atau Claude). Salin balik respon AI berformat JSON ke dalam aplikasi, lalu pratinjau hasilnya. Terakhir, Anda bisa mengunduh <b>Kartu Soal</b> berformat <b>Microsoft Word</b> (.docx) dan <b>JSON</b>.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
