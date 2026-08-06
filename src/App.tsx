import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Shell from './components/Shell';
import Dashboard from './components/Dashboard';
import Wizard from './components/Wizard';
import Admin from './components/Admin';
import Editor from './components/Editor';
import { api } from './lib/api';

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
          <span className="simple-icon">▣</span>
          <h1>Draft Lokal</h1>
          <p>Fitur tersedia di versi lengkap.</p>
        </div>
      )}
      {activeSection === 'guide' && (
        <div className="simple-page panel guide-content">
          <span className="simple-icon">?</span>
          <h1>Panduan Singkat</h1>
          <p>Silakan ikuti instruksi pada wizard untuk membuat soal.</p>
        </div>
      )}
      {activeSection === 'workspace' && (
        <div className="simple-page panel">
          <span className="simple-icon">◇</span>
          <h1>Ruang Kerja</h1>
          <p>Modul bank stimulus dan kualitas belum terhubung di preview ini.</p>
        </div>
      )}
      {activeSection === 'editor' && <Editor data={generatedData} />}
    </Shell>
  );
}
