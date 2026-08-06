import React, { useState } from 'react';

export default function Wizard({ settings, subjects, onComplete }: { settings: any, subjects: any[], onComplete: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    identity: { school: '', level: 'SD/MI', phase: 'Fase A', grade: '1', semester: 'Ganjil', schoolYear: '2026/2027', subject: '', topic: '', duration: 90 },
    learning: { cp: '', objectives: '' },
    counts: { regular: 5, literacy: 5, numeracy: 5 },
    forms: { pilihan_ganda: 5, pilihan_ganda_kompleks: 4, menjodohkan: 2, isian_singkat: 2, uraian: 2 },
    difficulties: { mudah: 5, sedang: 7, sulit: 3 },
    options: { enableLiteracy: true, enableNumeracy: true },
    author: { name: '', role: 'Guru', date: new Date().toISOString().slice(0,10) }
  });

  const nextStep = () => { if (step < 5) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleChange = (section: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => ({ ...prev, [section]: { ...(prev[section] as any), [field]: value } }));
  };

  const handleFinish = () => {
    onComplete(formData);
  };

  return (
    <section className="page-section">
      <div className="wizard-top">
        <div>
          <span className="eyebrow dark">PEMBUAT SOAL</span>
          <h1>Konfigurasi Asesmen</h1>
          <p>Lengkapi data secara bertahap. Draft tersimpan otomatis di perangkat.</p>
        </div>
      </div>

      <div className="stepper">
        {[1,2,3,4,5].map(s => (
          <React.Fragment key={s}>
            <button className={`step ${step === s ? 'active' : step > s ? 'done' : ''}`} onClick={() => setStep(s)}>
              <span>{step > s ? '✓' : s}</span>
              <div><b>Langkah {s}</b></div>
            </button>
            {s < 5 && <i />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={e => e.preventDefault()}>
        {step === 1 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>01</span><div><h2>Identitas Pembelajaran</h2></div></div>
            <div className="form-grid two">
              <label>Jenjang
                <select value={formData.identity.level} onChange={e => handleChange('identity', 'level', e.target.value)}>
                  <option>SD/MI</option><option>SMP/MTs</option>
                </select>
              </label>
              <label>Kelas
                <select value={formData.identity.grade} onChange={e => handleChange('identity', 'grade', e.target.value)}>
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option>
                </select>
              </label>
              <label>Mata Pelajaran
                <select value={formData.identity.subject} onChange={e => handleChange('identity', 'subject', e.target.value)}>
                  <option value="">Pilih...</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </label>
              <label>Topik / Materi <input value={formData.identity.topic} onChange={e => handleChange('identity', 'topic', e.target.value)} /></label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>02</span><div><h2>Capaian dan Tujuan Pembelajaran</h2></div></div>
            <div className="form-grid one">
              <label>Capaian Pembelajaran <textarea rows={4} value={formData.learning.cp} onChange={e => handleChange('learning', 'cp', e.target.value)} /></label>
              <label>Tujuan Pembelajaran <textarea rows={4} value={formData.learning.objectives} onChange={e => handleChange('learning', 'objectives', e.target.value)} /></label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>03</span><div><h2>Komposisi Soal</h2></div></div>
            <div className="composition-layout">
              <div>
                <h3 className="mini-title">Jumlah Kategori</h3>
                <div className="count-cards">
                  <label><b>Reguler</b><input type="number" value={formData.counts.regular} onChange={e => handleChange('counts', 'regular', parseInt(e.target.value))} /></label>
                  <label><b>Literasi</b><input type="number" value={formData.counts.literacy} onChange={e => handleChange('counts', 'literacy', parseInt(e.target.value))} /></label>
                  <label><b>Numerasi</b><input type="number" value={formData.counts.numeracy} onChange={e => handleChange('counts', 'numeracy', parseInt(e.target.value))} /></label>
                </div>
              </div>
              <div>
                <h3 className="mini-title">Distribusi Bentuk Soal</h3>
                <div className="form-count-list">
                  <label><span>Pilihan ganda</span><input type="number" value={formData.forms.pilihan_ganda} onChange={e => handleChange('forms', 'pilihan_ganda', parseInt(e.target.value))} /></label>
                  <label><span>Pilihan ganda kompleks</span><input type="number" value={formData.forms.pilihan_ganda_kompleks} onChange={e => handleChange('forms', 'pilihan_ganda_kompleks', parseInt(e.target.value))} /></label>
                  <label><span>Menjodohkan</span><input type="number" value={formData.forms.menjodohkan} onChange={e => handleChange('forms', 'menjodohkan', parseInt(e.target.value))} /></label>
                  <label><span>Uraian</span><input type="number" value={formData.forms.uraian} onChange={e => handleChange('forms', 'uraian', parseInt(e.target.value))} /></label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>04</span><div><h2>Komponen AKM dan Tingkat Kesulitan</h2></div></div>
            <div className="difficulty-layout">
              <div>
                <h3 className="mini-title">Kesulitan</h3>
                <div className="difficulty-cards">
                  <label><b>Mudah</b><input type="number" value={formData.difficulties.mudah} onChange={e => handleChange('difficulties', 'mudah', parseInt(e.target.value))} /></label>
                  <label><b>Sedang</b><input type="number" value={formData.difficulties.sedang} onChange={e => handleChange('difficulties', 'sedang', parseInt(e.target.value))} /></label>
                  <label><b>Sulit</b><input type="number" value={formData.difficulties.sulit} onChange={e => handleChange('difficulties', 'sulit', parseInt(e.target.value))} /></label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>05</span><div><h2>Prompt AI dan Konverter Word</h2></div></div>
            <div className="external-ai-grid">
              <article className="external-ai-card prompt-card">
                <h3>1. Prompt JSON</h3>
                <textarea className="code-textarea" readOnly value={JSON.stringify(formData, null, 2)} />
              </article>
              <article className="external-ai-card converter-card">
                <h3>2. JSON ke Word</h3>
                <p>Fitur ekspor dokumen telah disederhanakan pada versi ini.</p>
                <button className="btn btn-primary" onClick={handleFinish}>Buka di Editor</button>
              </article>
            </div>
          </div>
        )}

        <div className="wizard-actions">
          <button className={`btn btn-secondary ${step === 1 ? 'invisible' : ''}`} onClick={prevStep}>← Sebelumnya</button>
          <span>Draft tersimpan</span>
          {step < 5 ? (
            <button className="btn btn-primary" onClick={nextStep}>Selanjutnya →</button>
          ) : (
            <button className="btn btn-primary" onClick={handleFinish}>Selesai ✓</button>
          )}
        </div>
      </form>
    </section>
  );
}
