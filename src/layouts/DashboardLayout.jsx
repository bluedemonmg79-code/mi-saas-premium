import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, CalendarCheck, Settings, 
  Activity, Dumbbell, Scale, Building, Plus, LogOut, HeartPulse
} from 'lucide-react';
import { NICHES } from '../config/nicheConfig';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Novedad: Componente de Pantalla de Bienvenida (Onboarding)
function OnboardingView({ user, onComplete }) {
  const [saving, setSaving] = useState(null);

  const handleSelect = async (nicheKey) => {
    setSaving(nicheKey);
    try {
      await supabase.from('profiles').upsert({ id: user.id, niche: nicheKey });
      onComplete(); // Tells DashboardLayout to fetchProfile again!
    } catch(err) {
      console.error(err);
      setSaving(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #a855f7, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bienvenido a ProNexusGlobal
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          Para configurar tu plataforma, por favor selecciona la especialidad de tu negocio.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(NICHES).map(([key, config]) => {
             return (
               <button 
                 key={key}
                 onClick={() => handleSelect(key)}
                 disabled={saving !== null}
                 style={{
                   background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                   padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column',
                   alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.3s',
                   opacity: saving && saving !== key ? 0.3 : 1
                 }}
                 onMouseEnter={e => {
                   if (!saving) {
                     e.currentTarget.style.transform = 'translateY(-5px)';
                     e.currentTarget.style.borderColor = config.primaryColor;
                     e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                   }
                 }}
                 onMouseLeave={e => {
                   if (!saving) {
                     e.currentTarget.style.transform = 'translateY(0)';
                     e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                     e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                   }
                 }}
               >
                 <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `linear-gradient(135deg, ${config.primaryColor}22, ${config.secondaryColor}22)`, border: `1px solid ${config.primaryColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {
                     key === 'health' ? <Activity size={28} color={config.primaryColor} /> :
                     key === 'medicine' ? <HeartPulse size={28} color={config.primaryColor} /> :
                     key === 'legal' ? <Scale size={28} color={config.primaryColor} /> :
                     key === 'fitness' ? <Dumbbell size={28} color={config.primaryColor} /> :
                     <Building size={28} color={config.primaryColor} />
                   }
                 </div>
                 <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{config.appName}</h3>
                 <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                   Modo {key === 'health' ? 'Dentista' : key === 'medicine' ? 'Medicina' : key === 'legal' ? 'Abogado' : key === 'fitness' ? 'Fitness' : 'Arquitecto'}
                 </span>
                 {saving === key && <div style={{ width: 16, height: 16, border: `2px solid ${config.primaryColor}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
               </button>
             )
          })}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}

function DashboardLayout({ currentNiche, setCurrentNiche }) {
  const config = NICHES[currentNiche];
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Novedad: Control de carga visual
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const isPremium = userProfile?.subscription_status === 'active';

  const fetchProfile = async () => {
    if (!user) {
      setIsInitialLoading(false);
      return;
    }
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setUserProfile(data);
      if (data.logo_url) setLogoUrl(data.logo_url);
      if (data.niche) {
        setCurrentNiche(data.niche);
      }
    }
    setIsInitialLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleNewAction = () => {
    if (currentNiche === 'health' || currentNiche === 'medicine') {
      navigate('/dashboard/calendar?add=true');
    } else {
      navigate('/dashboard/entities?add=true');
    }
  };

  // Novedad: Interceptador de Carga
  if (isInitialLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'rgba(255,255,255,0.4)', gap: '12px' }}>
        <div style={{ width: 20, height: 20, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        Comprobando credenciales...
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  // Novedad: Intercepción de Onboarding para Nuevos Usuarios (SIN PERFIL O SIN NICHO)
  if (!userProfile || !userProfile.niche) {
    return <OnboardingView user={user} onComplete={fetchProfile} />;
  }

  // Variables inyectadas de UI
  const themeStyles = {
    '--accent-cyan': config.primaryColor,
    '--accent-purple': config.secondaryColor,
  };

  const getLogoIcon = () => {
    if (logoUrl) return <img src={logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />;
    if (currentNiche === 'health') return <Activity />;
    if (currentNiche === 'medicine') return <HeartPulse />;
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
              onClick={() => isPremium ? navigate('/dashboard/settings') : navigate('/pricing')}
              style={{
                width: '100%', padding: '0.8rem', cursor: 'pointer', borderRadius: '10px',
                border: isPremium ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(99,102,241,0.4)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                background: isPremium ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
                color: isPremium ? '#10b981' : '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = isPremium ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))' : 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))'}
              onMouseLeave={e => e.currentTarget.style.background = isPremium ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))'}
            >
              {isPremium ? '✦ Suscripción Activa' : '✦ Mejorar Plan'}
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
            
            {/* HEMOS ELIMINADO EL DROPDOWN DEL NICHO, AHORA ES PURO Y LIMPIO */}
            
            <button onClick={handleNewAction} className="btn-primary">
              <Plus size={18} /> {config.labels.newAction}
            </button>
          </div>
        </header>

        {/* CONTENIDO VARIABLE (PÁGINAS) */}
        <div className="page-content-wrapper" style={{ marginTop: '2rem' }}>
          <Outlet context={{ currentNiche, config, userProfile }} />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
