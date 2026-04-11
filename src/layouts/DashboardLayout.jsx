import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, Settings, 
  Activity, Dumbbell, Scale, Building, Plus, LogOut
} from 'lucide-react';
import { NICHES } from '../config/nicheConfig';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function DashboardLayout({ currentNiche, setCurrentNiche }) {
  const config = NICHES[currentNiche];
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('logo_url').eq('id', user.id).single();
      if (data && data.logo_url) setLogoUrl(data.logo_url);
    };
    fetchProfile();
  }, [user]);

  // Variables inyectadas de UI
  const themeStyles = {
    '--accent-cyan': config.primaryColor,
    '--accent-purple': config.secondaryColor,
  };

  const getLogoIcon = () => {
    if (logoUrl) return <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />;
    if (currentNiche === 'health') return <Activity />;
    if (currentNiche === 'legal') return <Scale />;
    if (currentNiche === 'fitness') return <Dumbbell />;
    if (currentNiche === 'realestate') return <Building />;
  };

  return (
    <div className="layout-container" style={themeStyles}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon" style={logoUrl ? { padding: 0, overflow: 'hidden', background: 'transparent' } : {}}>
            {getLogoIcon()}
          </div>
          <span className="logo-text">{config.appName}</span>
        </div>

        <nav className="nav-menu">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard /> {config.labels.dashboardTitle.split(' ')[0]}
          </NavLink>
          <NavLink 
            to="/dashboard/entities" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Users /> {config.labels.clients}
          </NavLink>
          <NavLink 
            to="/dashboard/calendar" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <CalendarCheck /> {config.labels.appointments}
          </NavLink>
          <NavLink 
            to="/dashboard/settings" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Settings /> Configuración
          </NavLink>
        </nav>
        
        <div style={{ padding: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => navigate('/pricing')}
            style={{
              width: '100%', padding: '0.8rem', cursor: 'pointer', borderRadius: '10px',
              border: '1px solid rgba(99,102,241,0.4)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
              color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))'}
            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))'}
          >
            ✦ Mejorar Plan
          </button>
          <button 
            onClick={logout}
            style={{ 
              width: '100%', padding: '0.8rem', background: 'transparent', 
              border: 'none', color: '#f87171', display: 'flex', 
              alignItems: 'center', gap: '10px', cursor: 'pointer',
              borderRadius: '8px', transition: 'all 0.2s ease',
            }}
            className="logout-btn"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Buenos días, {config.labels.welcome}</h1>
            <p className="header-subtitle">Su {config.labels.dashboardTitle.toLowerCase()} para el día de hoy.</p>
          </div>
          <div className="header-actions">
            
            {/* TRAYECTO DE DESARROLLO: SELECTOR DE NICHOS */}
            <div className="niche-selector">
              <select 
                value={currentNiche} 
                onChange={(e) => setCurrentNiche(e.target.value)}
                className="niche-dropdown"
              >
                <option value="health">Modo Dentista</option>
                <option value="legal">Modo Abogado</option>
                <option value="fitness">Modo Gimnasio</option>
                <option value="realestate">Modo Arquitecto</option>
              </select>
            </div>

            <button className="btn-primary">
              <Plus size={18} /> {config.labels.newAction}
            </button>
          </div>
        </header>

        {/* CONTENIDO VARIABLE (PÁGINAS) */}
        <div className="page-content-wrapper" style={{ marginTop: '2rem' }}>
          <Outlet context={{ currentNiche, config }} />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
