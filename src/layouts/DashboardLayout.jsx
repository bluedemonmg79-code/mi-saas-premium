import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Users, CalendarCheck, Settings, 
  Activity, Dumbbell, Scale, Building, Plus, LogOut, HeartPulse, Bell, Check, ChevronDown,
  Home, Stethoscope, Briefcase
} from 'lucide-react';
import { NICHES } from '../config/nicheConfig';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Novedad: Componente de Pantalla de Bienvenida (Onboarding)
function OnboardingView({ user, onComplete }) {
  const [saving, setSaving] = useState(null);
  const { t } = useTranslation();

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
                     key === 'realestate' ? <Building size={28} color={config.primaryColor} /> :
                     <Building size={28} color={config.primaryColor} />
                   }
                 </div>
                 <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{config.appName}</h3>
                 <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                   Modo {key === 'health' ? 'Dentista' : key === 'medicine' ? 'Medicina' : key === 'legal' ? 'Abogado' : key === 'fitness' ? 'Fitness' : key === 'realestate' ? 'Inmobiliaria' : 'General'}
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Novedad: Control de carga visual y Roles
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userRole, setUserRole] = useState('owner'); // 'owner' o 'member'
  const [ownerId, setOwnerId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const isPremium = userProfile?.subscription_status === 'active';

  const fetchProfile = async () => {
    if (!user) {
      setIsInitialLoading(false);
      return;
    }

    try {
      // 1. Cargar en paralelo mi perfil y si soy miembro de un equipo
      const [profileRes, teamRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('team_members').select('owner_id').eq('member_email', user.email).maybeSingle()
      ]);

      let effectiveOwnerId = user.id;
      let currentRole = 'owner';
      let activeProfile = profileRes.data;

      // 2. Si soy un colaborador, mi "dueño" es otro
      if (teamRes.data && teamRes.data.owner_id !== user.id) {
        effectiveOwnerId = teamRes.data.owner_id;
        currentRole = 'member';
        
        // Cargar el perfil del dueño (porque de ahí sacamos el nicho y suscripción)
        const { data: ownerProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', effectiveOwnerId)
          .single();
        if (ownerProfile) activeProfile = ownerProfile;
      }

      setOwnerId(effectiveOwnerId);
      setUserRole(currentRole);

      // 3. Contar entidades del DUEÑO para limites de plan (en paralelo con lo anterior no es posible, pero podemos lanzarlo ya)
      const { count: countData } = await supabase
        .from('entities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', effectiveOwnerId);
      
      if (activeProfile) {
        setUserProfile({ ...activeProfile, entityCount: countData || 0 });
        if (activeProfile.logo_url) setLogoUrl(activeProfile.logo_url);
        if (activeProfile.niche) {
          setCurrentNiche(activeProfile.niche);
        }
      }
    } catch (err) {
      console.error("Error cargando perfil/equipo:", err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchNotifications();

    // Suscripción Realtime para notificaciones
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        if (payload.new.user_id === user.id) {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(c => c + 1);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    
    if (!error) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

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
        {t('dashboard.loading_auth')}
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
    if (currentNiche === 'health') return <Activity color="var(--accent-cyan)" />;
    if (currentNiche === 'medicine') return <Stethoscope color="var(--accent-cyan)" />;
    if (currentNiche === 'legal') return <Scale color="var(--accent-cyan)" />;
    if (currentNiche === 'fitness') return <Dumbbell color="var(--accent-cyan)" />;
    if (currentNiche === 'realestate') return <Home color="var(--accent-cyan)" />;
    return <Briefcase color="var(--accent-cyan)" />;
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
            end
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard /> {t('sidebar.dashboard')}
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
          {userRole === 'owner' && (
            <NavLink 
              to="/dashboard/settings" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Settings /> {t('sidebar.settings')}
            </NavLink>
          )}

          {/* Botón de Notificaciones */}
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <button 
              onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
              className={`nav-item ${showNotifications ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', padding: '0.8rem 1rem' }}
            >
              <div style={{ position: 'relative' }}>
                <Bell size={20} />
                {unreadCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #1e293b' }}>{unreadCount}</span>}
              </div>
              {t('sidebar.notifications')}
            </button>

            {showNotifications && (
              <div style={{ position: 'absolute', bottom: '0', left: '105%', width: '280px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', padding: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 1000 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Recientes</h4>
                  {unreadCount > 0 && <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer' }}>Marcar todas</button>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', margin: '1rem 0' }}>No tienes avisos nuevos</p>
                  ) : notifications.map(n => (
                    <div key={n.id} style={{ padding: '0.8rem', background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                      <p style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 600 }}>{n.title}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.3' }}>{n.message}</p>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', display: 'block', marginTop: '4px' }}>{new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
        
        <div style={{ padding: '1rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Barra de progreso de uso (Siempre visible para control) */}
            {(() => {
              const planType = userProfile?.plan_type || 'free';
              return (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                    <span>{t('dashboard.usage_label')}: {userProfile?.entityCount || 0} / {planType === 'pro' ? '∞' : (isPremium ? 100 : 20)} {config.labels.clients.toLowerCase()}</span>
                    {planType !== 'pro' && (
                      <span>{Math.round(((userProfile?.entityCount || 0) / (isPremium ? 100 : 20)) * 100)}%</span>
                    )}
                  </div>
                  {planType !== 'pro' && (
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(((userProfile?.entityCount || 0) / (isPremium ? 100 : 20)) * 100, 100)}%`,
                        background: isPremium ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  )}
                </div>
              );
            })()}

            {userRole === 'owner' && (
              <button
                onClick={() => (isPremium && userProfile?.plan_type === 'pro') ? navigate('/dashboard/settings') : navigate('/pricing')}
                style={{
                  width: '100%', padding: '0.8rem', cursor: 'pointer', borderRadius: '10px',
                  border: (isPremium && userProfile?.plan_type === 'pro') ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(99,102,241,0.4)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
                  background: (isPremium && userProfile?.plan_type === 'pro') ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
                  color: (isPremium && userProfile?.plan_type === 'pro') ? '#10b981' : '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = (isPremium && userProfile?.plan_type === 'pro') ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))' : 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))'}
                onMouseLeave={e => e.currentTarget.style.background = (isPremium && userProfile?.plan_type === 'pro') ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' : 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))'}
              >
                {(isPremium && userProfile?.plan_type === 'pro') ? t('dashboard.upgrade_pro') : (isPremium && userProfile?.plan_type === 'basic') ? t('dashboard.upgrade_basic') : t('dashboard.upgrade_free')}
              </button>
            )}
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
            <LogOut size={18} /> {t('sidebar.logout')}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>{t('dashboard.welcome')}, {config.labels.welcome}</h1>
            <p className="header-subtitle">{t('dashboard.subtitle', { nicheLabel: (config.labels.dashboardTitle || 'Resumen').toLowerCase() })}</p>
          </div>
          <div className="header-actions">
            
            {/* HEMOS ELIMINADO EL DROPDOWN DEL NICHO, AHORA ES PURO Y LIMPIO */}
            
            <button onClick={handleNewAction} className="btn-primary">
              <Plus size={18} /> {config.labels.newAction}
            </button>
          </div>
        </header>

        {/* CONTENIDO VARIABLE (PÁGINAS) */}
        <div className="page-content">
          <Outlet context={{ config, currentNiche, userProfile, fetchProfile, userRole, ownerId }} />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
