import React, { useState } from 'react';

interface ShellProps {
  user: any;
  settings: any;
  onLogout: () => void;
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (s: string) => void;
}

export default function Shell({ user, settings, onLogout, children, activeSection, setActiveSection }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const navItems = [
    { id: 'dashboard', icon: '⌂', label: 'Dashboard' },
    { id: 'wizard', icon: '✦', label: 'Buat Soal' },
    { id: 'workspace', icon: '◇', label: 'Ruang Kerja' },
    { id: 'draft', icon: '▣', label: 'Draft Lokal' },
    { id: 'guide', icon: '?', label: 'Panduan' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', icon: '⚙', label: 'Menu Admin' });
  }

  const sectionTitles: Record<string, [string, string]> = {
    dashboard: ['Dashboard', 'Ringkasan aktivitas penyusunan soal'],
    wizard: ['Buat Soal', 'Susun konfigurasi asesmen secara bertahap'],
    editor: ['Editor Hasil', 'Tinjau dan rapikan soal sebelum ekspor'],
    workspace: ['Ruang Kerja', 'Impor, bank stimulus, analisis mutu, telaah, dan riwayat lokal'],
    draft: ['Draft Lokal', 'Data tersimpan pada perangkat ini'],
    guide: ['Panduan', 'Cara menggunakan aplikasi'],
    admin: ['Menu Admin', 'Pengguna, tampilan, dan master mata pelajaran'],
  };

  const [title, subtitle] = sectionTitles[activeSection] || sectionTitles.dashboard;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src={settings?.logoUrl || "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lambang_Kabupaten_Pasuruan.png"} alt="Logo" />
          <div><strong>{settings?.appName || "AN/AKM"}</strong><span>Soal Generator</span></div>
        </div>
        <nav className="side-nav">
          {navItems.map(item => (
            <button key={item.id} className={`nav-item ${activeSection === item.id ? 'active' : ''}`} onClick={() => handleNav(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="profile-button">
            <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
            <span><strong>{user?.name}</strong><small>{user?.role === 'admin' ? 'Administrator' : 'Guru'}</small></span>
            <b>›</b>
          </button>
          <button className="logout-button" onClick={onLogout}><span>↪</span>Keluar</button>
        </div>
      </aside>

      <header className="topbar">
        <button className="icon-button mobile-only" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <div><h2>{title}</h2><p>{subtitle}</p></div>
        <div className="top-actions">
          <span className="status-dot"><i></i>Tersimpan lokal</span>
          <button className="btn btn-primary btn-small" onClick={() => handleNav('wizard')}>＋ Buat Soal</button>
        </div>
      </header>

      <main className="content-area">
        {children}
      </main>

      <nav className="mobile-nav">
        {navItems.slice(0, 4).map(item => (
          <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => handleNav(item.id)}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
