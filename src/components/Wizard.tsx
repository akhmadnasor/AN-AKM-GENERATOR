import React, { useState, useMemo, useEffect } from 'react';
import { buildExternalAiPrompt } from '../lib/promptBuilder';
import { parseExternalAiJson } from '../lib/jsonParser';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Wizard({ settings, subjects, user, onComplete }: { settings: any, subjects: any[], user: any, onComplete: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('wizardDraft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed.learning)) parsed.learning = [parsed.learning || { cp: '', objectives: '' }];
        return parsed;
      } catch (e) {}
    }
    return {
      identity: { school: user?.school || '', level: 'SD/MI', phase: 'Fase A', grade: '1', semester: 'Ganjil', schoolYear: '2026/2027', subject: '', topic: '', duration: 90 },
      learning: [{ cp: '', objectives: '' }],
      counts: { regular: 5, literacy: 5, numeracy: 5 },
      forms: { pilihan_ganda: 5, pilihan_ganda_kompleks: 4, menjodohkan: 2, isian_singkat: 2, uraian: 2 },
      difficulties: { mudah: 5, sedang: 7, sulit: 3 },
      options: { enableLiteracy: true, enableNumeracy: true, packageMode: 'Tunggal', includeImages: false },
      author: { name: user?.name || '', role: 'Guru', date: new Date().toISOString().slice(0,10), nip: '', school: user?.school || '', city: '' }
    };
  });

  useEffect(() => {
    localStorage.setItem('wizardDraft', JSON.stringify(formData));
  }, [formData]);

  const [aiJsonInput, setAiJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const generatedPrompt = useMemo(() => buildExternalAiPrompt(formData), [formData]);
  const nextStep = () => { if (step < 5) setStep(step + 1); };
  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const handleLearningChange = (index: number, field: "cp" | "objectives", value: string) => {
    setFormData(prev => {
      const newLearning = [...prev.learning];
      newLearning[index] = { ...newLearning[index], [field]: value };
      return { ...prev, learning: newLearning };
    });
  };

  const addLearning = () => {
    setFormData(prev => ({
      ...prev,
      learning: [...prev.learning, { cp: "", objectives: "" }]
    }));
  };

  const removeLearning = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learning: prev.learning.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (section: keyof typeof formData, field: string, value: any) => {
    setFormData(prev => {
      let newData = { ...prev, [section]: { ...(prev[section] as any), [field]: value } };
      
      // Auto-update phase and level when grade changes
      if (section === 'identity' && field === 'grade') {
        const gradeStr = String(value);
        let phase = prev.identity.phase;
        let level = prev.identity.level;
        
        if (['1', '2'].includes(gradeStr)) { phase = 'Fase A'; level = 'SD/MI'; }
        else if (['3', '4'].includes(gradeStr)) { phase = 'Fase B'; level = 'SD/MI'; }
        else if (['5', '6'].includes(gradeStr)) { phase = 'Fase C'; level = 'SD/MI'; }
        else if (['7', '8', '9'].includes(gradeStr)) { phase = 'Fase D'; level = 'SMP/MTs'; }
        
        newData.identity.phase = phase;
        newData.identity.level = level;
      }
      
      // Auto-update grade when level changes
      if (section === 'identity' && field === 'level') {
        if (value === 'SD/MI' && ['7', '8', '9'].includes(String(prev.identity.grade))) {
          newData.identity.grade = '1';
          newData.identity.phase = 'Fase A';
        } else if (value === 'SMP/MTs' && ['1', '2', '3', '4', '5', '6'].includes(String(prev.identity.grade))) {
          newData.identity.grade = '7';
          newData.identity.phase = 'Fase D';
        }
      }
      
      return newData;
    });
  };

  const handleFinish = () => {
    try {
      setJsonError('');
      const parsedData = parseExternalAiJson(aiJsonInput);
      localStorage.removeItem('wizardDraft');
      onComplete(parsedData);
    } catch (err: any) {
      setJsonError(err.message || 'Gagal memproses JSON');
    }
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
              <span>{step > s ? <Check size={16} strokeWidth={3} /> : s}</span>
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
                  {subjects.filter(s => s.level === formData.identity.level || !s.level).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </label>
              <label>Topik / Materi <input value={formData.identity.topic} onChange={e => handleChange('identity', 'topic', e.target.value)} /></label>
              
              <label>Semester
                <select value={formData.identity.semester} onChange={e => handleChange('identity', 'semester', e.target.value)}>
                  <option>Ganjil</option><option>Genap</option>
                </select>
              </label>
              <label>Tahun Pelajaran <input value={formData.identity.schoolYear} onChange={e => handleChange('identity', 'schoolYear', e.target.value)} /></label>
              <label>Nama Sekolah <input value={formData.identity.school} onChange={e => { handleChange('identity', 'school', e.target.value); handleChange('author', 'school', e.target.value); }} /></label>
              <label>Alokasi Waktu (Menit) <input type="number" value={formData.identity.duration} onChange={e => handleChange('identity', 'duration', parseInt(e.target.value))} /></label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>02</span><div><h2>Capaian dan Tujuan Pembelajaran</h2></div></div>
            <div className="form-grid one">
              {formData.learning.map((item, index) => (
                <div key={index} style={{ marginBottom: "1.5rem", padding: "1.5rem", border: "1px solid #e2e8f0", borderRadius: "0.75rem", position: "relative", background: "#fafafa" }}>
                  {formData.learning.length > 1 && (
                    <button type="button" onClick={() => removeLearning(index)} style={{ position: "absolute", top: "1rem", right: "1rem", color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}>Hapus</button>
                  )}
                  <label style={{ display: "block", marginBottom: "1rem" }}>Capaian Pembelajaran (CP) {index + 1} <textarea rows={3} style={{ marginTop: "0.5rem", width: "100%" }} value={item.cp} onChange={e => handleLearningChange(index, "cp", e.target.value)} /></label>
                  <label style={{ display: "block" }}>Tujuan Pembelajaran (TP) {index + 1} <textarea rows={3} style={{ marginTop: "0.5rem", width: "100%" }} value={item.objectives} onChange={e => handleLearningChange(index, "objectives", e.target.value)} /></label>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addLearning} style={{ alignSelf: "flex-start" }}>+ Tambah CP & TP</button>
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
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                <input type="checkbox" style={{ width: '1.25rem', height: '1.25rem' }} checked={formData.options.includeImages || false} onChange={e => handleChange('options', 'includeImages', e.target.checked)} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>Sertakan referensi visual (prompt gambar) yang relevan untuk soal-soal Komponen AKM</span>
              </label>
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
                  <label><div className="difficulty-dot easy"></div><div><b>Mudah</b></div><input type="number" value={formData.difficulties.mudah} onChange={e => handleChange('difficulties', 'mudah', parseInt(e.target.value))} /></label>
                  <label><div className="difficulty-dot medium"></div><div><b>Sedang</b></div><input type="number" value={formData.difficulties.sedang} onChange={e => handleChange('difficulties', 'sedang', parseInt(e.target.value))} /></label>
                  <label><div className="difficulty-dot hard"></div><div><b>Sulit</b></div><input type="number" value={formData.difficulties.sulit} onChange={e => handleChange('difficulties', 'sulit', parseInt(e.target.value))} /></label>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="wizard-panel">
            <div className="section-heading"><span>05</span><div><h2>Prompt AI dan Konversi JSON</h2></div></div>
            <div className="external-ai-grid">
              <article className="external-ai-card prompt-card">
                <h3>1. Salin Prompt JSON</h3>
                <p>Salin teks ini dan tempel ke web AI (ChatGPT, Gemini, Claude, dll).</p>
                <textarea className="code-textarea" readOnly value={generatedPrompt} />
                <button type="button" className="btn btn-secondary btn-small" onClick={() => navigator.clipboard.writeText(generatedPrompt)}>Salin Prompt</button>
              </article>
              <article className="external-ai-card converter-card">
                <h3>2. Tempel Hasil JSON</h3>
                <p>Tempel balasan dari AI di sini untuk diubah menjadi soal utuh.</p>
                <textarea className="code-textarea" placeholder="Tempel JSON dari AI di sini..." value={aiJsonInput} onChange={e => setAiJsonInput(e.target.value)} />
                {jsonError && <p className="error-text" style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.875rem' }}>{jsonError}</p>}
                <button type="button" className="btn btn-primary" onClick={handleFinish} style={{ marginTop: '1rem' }}>Buka di Editor</button>
              </article>
            </div>
          </div>
        )}

        <div className="wizard-actions">
          <button type="button" className={`btn btn-secondary ${step === 1 ? 'invisible' : ''}`} onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Sebelumnya
          </button>
          <span>Draft tersimpan</span>
          {step < 5 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Selanjutnya <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleFinish} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              Selesai <Check size={16} />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
