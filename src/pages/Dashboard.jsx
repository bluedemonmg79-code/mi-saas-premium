import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, CalendarCheck, DollarSign, TrendingUp, Loader, Clock, Phone, Mail, X, CheckCircle, MessageCircle, Trash2, Zap, ArrowRight } from 'lucide-react';
import DashboardChart from '../components/DashboardChart';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Límites de plan centralizados
const PLAN_LIMITS = { free: 20, basic: 100, pro: Infinity };

function UpgradeBanner({ entitiesCount, planType, onUpgrade }) {
  const { t } = useTranslation();
  const limit = PLAN_LIMITS[planType] || 8;
  if (limit === Infinity) return null; // Plan Pro no muestra banner

  const pct = Math.round((entitiesCount / limit) * 100);
  if (pct < 10) return null; // Muestra solo cuando va al 10%+

  const isUrgent = pct >= 90;
  const isCritical = pct >= 100;

  const color = isCritical ? '#ef4444' : isUrgent ? '#f59e0b' : '#6366f1';
  const bgColor = isCritical ? 'rgba(239,68,68,0.08)' : isUrgent ? 'rgba(245,158,11,0.08)' : 'rgba(99,102,241,0.08)';
  const borderColor = isCritical ? 'rgba(239,68,68,0.3)' : isUrgent ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.3)';

  const message = isCritical
    ? t('dashboard.limit_reached')
    : isUrgent
    ? t('dashboard.limit_urgent', { remaining: limit - entitiesCount })
    : t('dashboard.usage_pct', { pct, count: entitiesCount, limit });

  return (
    <div style={{
      background: bgColor, border: `1px solid ${borderColor}`,
      borderRadius: '14px', padding: '1rem 1.5rem', marginBottom: '1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Zap size={16} color={color} />
          <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>{message}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${Math.min(pct, 100)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: '10px', transition: 'width 0.6s ease',
          }} />
        </div>
        <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
          {planType === 'free'
            ? t('dashboard.upgrade_to_basic')
            : t('dashboard.upgrade_to_pro')}
        </p>
      </div>
      <button
        onClick={onUpgrade}
        style={{
          padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', whiteSpace: 'nowrap',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: `0 4px 15px ${color}44`, transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <ArrowRight size={14} />
        {planType === 'free' ? t('dashboard.view_basic') : t('dashboard.upgrade_pro_btn')}
      </button>
    </div>
  );
}

function Dashboard() {
  const { config, currentNiche, userProfile, ownerId, userRole } = useOutletContext();
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const planType = userProfile?.plan_type || 'free';
  const isPremium = userProfile?.subscription_status === 'active';
  
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [entitiesCount, setEntitiesCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const targetId = ownerId || user.id;

      // 1. Obtener conteo real de entidades
      const { count } = await supabase
        .from('entities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', targetId)
        .eq('niche', currentNiche);
      
      setEntitiesCount(count || 0);

      // 2. Obtener las próximas citas
      const { data: apps } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', targetId)
        .eq('niche', currentNiche)
        .order('time', { ascending: true })
        .limit(4);

      setAppointments(apps || []);

      // 3. Obtener ingresos totales del MES ACTUAL
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const dateStr = firstDayOfMonth.toISOString().split('T')[0];

      const { data: revenueData } = await supabase
        .from('appointments')
        .select('price')
        .eq('user_id', targetId)
        .eq('niche', currentNiche)
        .eq('status', 'confirmed')
        .gte('full_date', dateStr);
      
      const total = revenueData?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
      setTotalRevenue(total);

      // 4. Obtener datos para la GRÁFICA (últimos 6 meses)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      
      const { data: historyData } = await supabase
        .from('appointments')
        .select('price, full_date')
        .eq('user_id', targetId)
        .eq('niche', currentNiche)
        .eq('status', 'confirmed')
        .gte('full_date', sixMonthsAgo.toISOString().split('T')[0]);

      const monthlyData = [];
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(today.getMonth() - (5 - i));
        const mName = monthNames[d.getMonth()];
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        
        const monthlySum = historyData?.filter(a => a.full_date?.startsWith(mKey))
          .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
        
        monthlyData.push({ name: mName, ingresos: monthlySum });
      }
      setChartData(monthlyData);

      setLoading(false);
    };

    fetchDashboardData();

    // SUSCRIPCIÓN REALTIME (Para ver nuevas citas al instante)
    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentNiche, user?.id, ownerId]);

  const stats = [
    ...(userRole === 'owner' ? [{ title: config.labels.revenue, value: `$${totalRevenue.toLocaleString()}`, change: t('dashboard.this_month'), isPos: true, icon: <DollarSign />, type: 'revenue' }] : []),
    { title: config.labels.appointments, value: appointments.length.toString(), change: "+1", isPos: true, icon: <CalendarCheck />, type: 'appointments' },
    { title: t('dashboard.total_label', { label: config.labels.clients }), value: entitiesCount.toString(), change: "+New", isPos: true, icon: <Users />, type: 'patients' }
  ];

  return (
    <>
      {/* BANNER DE UPGRADE DINÁMICO */}
      <UpgradeBanner
        entitiesCount={entitiesCount}
        planType={isPremium ? (userProfile?.plan_type || 'basic') : 'free'}
        onUpgrade={() => navigate('/pricing')}
      />

      {/* STATS */}
      <section className="stats-grid">
        {stats.map((stat, idx) => (
          <div className="stat-card" key={idx}>
            <div className={`stat-icon ${stat.type}`}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.isPos ? 'pos' : 'neg'}`}>
                {stat.change} {t('dashboard.vs_previous')}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* BOTTOM SECTION */}
      <section className="bottom-grid">
        {/* Revenue Chart Real */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2><TrendingUp size={20} color="var(--accent-cyan)"/> Progreso Comercial</h2>
          <div style={{ flex: 1, display: 'flex' }}>
            <DashboardChart data={chartData} />
          </div>
        </div>

        {/* Appointments */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
              <CalendarCheck size={20} color="var(--accent-purple)" /> {t('dashboard.upcoming_label', { label: config.labels.appointments })}
            </h2>
            <button onClick={() => navigate('/dashboard/calendar')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'pointer' }}>{t('dashboard.view_all')}</button>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
              <Loader style={{ animation: 'spin 1s infinite' }} />
            </div>
          ) : appointments.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '2rem 0' }}>No hay citas próximas.</p>
          ) : (
            <div className="appointment-list">
              {appointments.map(app => (
                <div key={app.id} className="appointment-item" onClick={() => setSelectedApp(app)} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                  <div className="app-time">
                    {app.time}
                    {app.full_date && <span style={{ display: 'block', fontSize: '10px', opacity: 0.5 }}>{app.full_date.split('-').slice(1).reverse().join('/')}</span>}
                  </div>
                  <div className="app-details">
                    <h4>{app.name}</h4>
                    <p>{app.detail || (app.origin === 'web' ? 'Agendado vía Web' : '')}</p>
                  </div>
                  <div className={`app-status ${app.status}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {app.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal de Detalle Rápido */}
      {selectedApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(8px)' }} onClick={() => setSelectedApp(null)}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2.5rem', width: '380px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedApp(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', padding: '8px' }}><X size={18} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Users size={30} />
              </div>
              <h2 style={{ margin: 0 }}>{selectedApp.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{selectedApp.full_date} a las {selectedApp.time}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
              {selectedApp.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px' }}>
                  <Phone size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.9rem' }}>{selectedApp.phone}</span>
                </div>
              )}
              {selectedApp.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '0.8rem', borderRadius: '12px' }}>
                  <Mail size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedApp.email}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {selectedApp.status === 'pending' && (
                <button 
                  disabled={updating}
                  onClick={async () => {
                    setUpdating(true);
                    const { error } = await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', selectedApp.id);
                    if (!error) {
                      setAppointments(appointments.map(a => a.id === selectedApp.id ? { ...a, status: 'confirmed' } : a));
                      setSelectedApp({ ...selectedApp, status: 'confirmed' });
                    }
                    setUpdating(false);
                  }}
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <CheckCircle size={18} /> {t('dashboard.confirm_appointment')}
                </button>
              )}
              
              {selectedApp.phone && (
                <button 
                  onClick={() => {
                    const msg = encodeURIComponent(`Hola ${selectedApp.name}, le confirmo su cita de ProNexus para el ${selectedApp.full_date}.`);
                    window.open(`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                  }}
                  style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <MessageCircle size={18} /> {t('dashboard.send_whatsapp')}
                </button>
              )}

              <button 
                onClick={async () => {
                  if(!window.confirm(t('dashboard.delete_confirm'))) return;
                  setUpdating(true);
                  const { error } = await supabase.from('appointments').delete().eq('id', selectedApp.id);
                  if (!error) {
                    setAppointments(appointments.filter(a => a.id !== selectedApp.id));
                    setSelectedApp(null);
                  }
                  setUpdating(false);
                }}
                style={{ width: '100%', padding: '0.9rem', borderRadius: '12px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Trash2 size={18} /> {t('dashboard.cancel_appointment')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
