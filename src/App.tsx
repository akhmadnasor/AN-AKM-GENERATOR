import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Shell from './components/Shell';
import Dashboard from './components/Dashboard';
import Wizard from './components/Wizard';
import Admin from './components/Admin';
import Editor from './components/Editor';
import Guide from './components/Guide';
import PrintView from './components/PrintView';
import { api } from './lib/api';
import { Save, Briefcase } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [generatedData, setGeneratedData] = useState<any>(null);

  useEffect(() => {
    let token = null;
    try {
      token = localStorage.getItem('token');
    } catch (err) {
      console.warn("Storage access restricted", err);
    }

    if (token) {
      api.getBootstrap()
        .then(res => {
          setUser(res.user);
          setSettings(res.settings);
          setSubjects(res.subjects);
        })
        .catch(() => {
          try { localStorage.removeItem('token'); } catch (e) {}
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (data: any) => {
    try { localStorage.setItem('token', data.token); } catch(e) {}
    setUser(data.user);
    try {
      const res = await api.getBootstrap();
      setSettings(res.settings);
      setSubjects(res.subjects);
    } catch (e) {}
  };

  const handleLogout = () => {
    try { localStorage.removeItem('token'); } catch(e) {}
    setUser(null);
  };

  if (loading) return <div className="app-loader"><p>Memuat...</p></div>;

  if (!user) {
    return <Auth onLogin={handleLogin} settings={settings} />;
  }

  return (
    <Shell
      user={user}
      settings={settings}
      onLogout={handleLogout}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
    >
      {activeSection === 'dashboard' && <Dashboard user={user} onNavigate={setActiveSection} />}
      {activeSection === 'wizard' && <Wizard settings={settings} subjects={subjects} user={user} onComplete={(d) => { setGeneratedData(d); setActiveSection('editor'); }} />}
      {activeSection === 'admin' && <Admin />}
      {activeSection === 'draft' && (
        <div className="simple-page panel">
          <span className="simple-icon"><Save size={48} color="#94a3b8" /></span>
          <h1>Draft Lokal</h1>
          <p>Draft pembuatan soal Anda tersimpan secara otomatis di browser ini. Anda dapat melanjutkannya dari menu <b>Dashboard</b> atau klik <b>Buat Soal</b>.</p>
          <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={() => setActiveSection('wizard')}>Buka Draft Terakhir</button>
        </div>
      )}
      {activeSection === 'guide' && <Guide onNavigate={setActiveSection} />}
      {activeSection === 'workspace' && (
        <div className="simple-page panel">
          <span className="simple-icon"><Briefcase size={48} color="#94a3b8" /></span>
          <h1>Ruang Kerja</h1>
          <p>Fitur Ruang Kerja sedang aktif dalam mode Lokal (Browser Storage). Anda dapat mengatur penyimpanan Ruang Kerja pada menu <b>Admin</b> &gt; <b>Konfigurasi</b>.</p>
          <button className="btn btn-secondary" style={{marginTop: '1rem'}} onClick={() => { if(user?.role==='admin') setActiveSection('admin'); else alert('Hubungi Administrator untuk mengubah pengaturan Ruang Kerja.'); }}>Atur Konfigurasi Ruang Kerja</button>
        </div>
      )}
      {activeSection === 'editor' && <Editor data={generatedData} onPrint={() => setActiveSection('print')} />}
      {activeSection === 'print' && <PrintView data={generatedData} onBack={() => setActiveSection('editor')} />}
    </Shell>
  );
}
