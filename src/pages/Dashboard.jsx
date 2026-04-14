import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, CalendarCheck, DollarSign, TrendingUp, Loader, Clock, Phone, Mail, X, CheckCircle, MessageCircle, Trash2 } from 'lucide-react';
import DashboardChart from '../components/DashboardChart';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { config, currentNiche } = useOutletContext();
  const { user } = useAuth();
  
  const [entitiesCount, setEntitiesCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      // Obtener conteo real de entidades
      const { count } = await supabase
        .from('entities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('niche', currentNiche);
      
      setEntitiesCount(count || 0);

      // Obtener las próximas citas
      const { data: apps } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .eq('niche', currentNiche)
        .order('time', { ascending: true })
        .limit(4);

      setAppointments(apps || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, [currentNiche, user.id]);

  const stats = [
    { title: config.labels.revenue, value: `$${(entitiesCount * 2500).toLocaleString()}`, change: "+12.5%", isPos: true, icon: <DollarSign />, type: 'revenue' },
    { title: config.labels.appointments, value: appointments.length.toString(), change: "+1", isPos: true, icon: <CalendarCheck />, type: 'appointments' },
    { title: `Total de ${config.labels.clients}`, value: entitiesCount.toString(), change: "+Nuevo", isPos: true, icon: <Users />, type: 'patients' }
  ];

  return (
    <>
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
                {stat.change} vs mes anterior
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
            <DashboardChart />
          </div>
        </div>

        {/* Appointments */}
        <div className="glass-panel">
          <h2>{config.labels.agendaT}</h2>
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
                  <CheckCircle size={18} /> Confirmar Cita ⚡
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
                  <MessageCircle size={18} /> Enviar WhatsApp
                </button>
              )}

              <button 
                onClick={async () => {
                  if(!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;
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
                <Trash2 size={18} /> Cancelar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
