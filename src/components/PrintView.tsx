import React, { useEffect } from 'react';

export default function PrintView({ data, onBack }: { data: any, onBack: () => void }) {
  if (!data) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Tidak ada data soal untuk dicetak.</p>
        <button onClick={onBack} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Kembali</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-view-container" style={{ backgroundColor: '#fff', minHeight: '100vh', padding: '2rem' }}>
      <div className="no-print" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>Halaman Siap Cetak</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Sesuaikan setelan printer Anda (margin, ukuran kertas) sebelum mencetak.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={onBack}>← Kembali ke Editor</button>
          <button className="btn btn-primary" onClick={handlePrint}>🖨️ Cetak Sekarang</button>
        </div>
      </div>

      <div className="print-document" style={{ maxWidth: '800px', margin: '0 auto', color: '#000', fontFamily: 'serif' }}>
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>NASKAH SOAL {data?.identitas?.mata_pelajaran}</h1>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            <strong>Fase/Kelas:</strong> {data?.identitas?.fase} / {data?.identitas?.kelas} &nbsp;|&nbsp;
            <strong>Topik:</strong> {data?.identitas?.topik || '-'}
          </p>
        </div>

        <div className="print-questions" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {(data?.soal || []).map((s: any, idx: number) => (
            <div key={idx} style={{ pageBreakInside: 'avoid' }}>
              
              {/* STIMULUS (If Exists) */}
              {s.stimulus_id && data.stimulus && (
                <div style={{ marginBottom: '1rem' }}>
                  {data.stimulus.filter((st: any) => st.stimulus_id === s.stimulus_id).map((st: any, stIdx: number) => (
                    <div key={stIdx} style={{ border: '1px solid #000', padding: '1rem', marginBottom: '0.5rem' }}>
                      {st.judul && <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', textAlign: 'center' }}>{st.judul}</h3>}
                      {st.konten && <p style={{ margin: 0, whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{st.konten}</p>}
                      {st.data_tabel && (
                        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                            <thead>
                              <tr>
                                {st.data_tabel.judul_kolom?.map((col: string, cIdx: number) => (
                                  <th key={cIdx} style={{ padding: '0.5rem', border: '1px solid #000', textAlign: 'left', fontWeight: 'bold' }}>{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {st.data_tabel.baris?.map((row: string[], rIdx: number) => (
                                <tr key={rIdx}>
                                  {row.map((cell: string, cIdx: number) => (
                                    <td key={cIdx} style={{ padding: '0.5rem', border: '1px solid #000' }}>{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* PERTANYAAN */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ fontWeight: 'bold' }}>{s.nomor}.</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 1rem 0', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{s.pokok_soal}</p>
                  
                  {/* TABEL DI SOAL */}
                  {s.data_tabel && (
                    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000' }}>
                        <thead>
                          <tr>
                            {s.data_tabel.judul_kolom?.map((col: string, cIdx: number) => (
                              <th key={cIdx} style={{ padding: '0.5rem', border: '1px solid #000', textAlign: 'left', fontWeight: 'bold' }}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.data_tabel.baris?.map((row: string[], rIdx: number) => (
                            <tr key={rIdx}>
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} style={{ padding: '0.5rem', border: '1px solid #000' }}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* PILIHAN JAWABAN */}
                  {s.pilihan_jawaban && s.pilihan_jawaban.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {s.pilihan_jawaban.map((p: any, pidx: number) => (
                        <div key={pidx} style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ minWidth: '1.5rem' }}>{p.kode || p.kiri || String.fromCharCode(65+pidx)}.</span>
                          <span>{p.teks || p.kanan || p.teks}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* UNTUK URAIAN/ISIAN */}
                  {(!s.pilihan_jawaban || s.pilihan_jawaban.length === 0) && (
                    <div style={{ marginTop: '2rem', borderBottom: '1px dotted #000', width: '100%' }}></div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
