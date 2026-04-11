import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, CalendarCheck, DollarSign, TrendingUp, Loader } from 'lucide-react';
import DashboardChart from '../components/DashboardChart';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { config, currentNiche } = useOutletContext();
  const { user } = useAuth();
  
  const [entitiesCount, setEntitiesCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <div key={app.id} className="appointment-item">
                  <div className="app-time">{app.time}</div>
                  <div className="app-details">
                    <h4>{app.name}</h4>
                    <p>{app.detail}</p>
                  </div>
                  <div className={`app-status ${app.status}`}>
                    {app.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Dashboard;
