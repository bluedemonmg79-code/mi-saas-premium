import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Search, Plus, X, Phone, Mail, Calendar, ChevronRight, Loader, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import PaywallModal from '../components/PaywallModal';

const FREE_PLAN_LIMIT = 3; // Máximo de registros en plan gratuito

const statusConfig = {
  active:   { label: 'Activo',    color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  pending:  { label: 'Pendiente', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  inactive: { label: 'Inactivo', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
};

function ProfileModal({ entity, config, onClose }) {
  const s = statusConfig[entity.status] || statusConfig.active;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', width: '440px', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', padding: '6px', display: 'flex' }}><X size={18} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>{entity.avatar}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{entity.name}</h2>
            <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>{s.label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><Mail size={16} color="var(--accent-cyan)" /> {entity.email || 'Sin correo'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><Phone size={16} color="var(--accent-cyan)" /> {entity.phone || 'Sin teléfono'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'rgba(255,255,255,0.7)' }}><Calendar size={16} color="var(--accent-cyan)" /> Registro: {entity.created_at?.split('T')[0] || entity.date || '-'}</div>
          {entity.detail && <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', marginTop: '0.5rem' }}><p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Servicio / Tratamiento</p><p style={{ margin: 0, fontWeight: 600 }}>{entity.detail}</p></div>}
        </div>
      </div>
    </div>
  );
}

function NewEntityModal({ config, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', detail: '' });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };
  const inputStyle = { width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', width: '480px', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', padding: '6px', display: 'flex' }}><X size={18} /></button>
        <h2 style={{ marginBottom: '1.5rem' }}>Nuevo {config.labels.clients.replace(/s$/, '')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Nombre completo *</label><input required placeholder="Ej. Juan Pérez" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Correo electrónico</label><input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Teléfono</label><input placeholder="555-0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Servicio / Tratamiento</label><input placeholder="Ej. Consulta inicial" value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} style={inputStyle} /></div>
          <button type="submit" disabled={saving} style={{ marginTop: '0.5rem', padding: '0.9rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', color: '#0f172a', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', fontSize: '1rem' }}>
            {saving ? '⏳ Guardando...' : 'Guardar Registro'}
          </button>
        </form>
      </div>
    </div>
  );
}

function EntityList() {
  const { config, currentNiche } = useOutletContext();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleNewClick = () => {
    if (entities.length >= FREE_PLAN_LIMIT) {
      setShowPaywall(true);
    } else {
      setShowNew(true);
    }
  };

  const fetchEntities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('user_id', user.id)
      .eq('niche', currentNiche)
      .order('created_at', { ascending: false });
    if (!error) setEntities(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntities(); }, [currentNiche]);

  const handleSave = async (form) => {
    const avatar = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const { error } = await supabase.from('entities').insert([{
      user_id: user.id, niche: currentNiche, avatar,
      name: form.name, email: form.email, phone: form.phone,
      detail: form.detail, status: 'active'
    }]);
    if (!error) fetchEntities();
  };

  const filtered = entities.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    (e.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {selected && <ProfileModal entity={selected} config={config} onClose={() => setSelected(null)} />}
      {showNew && <NewEntityModal config={config} onClose={() => setShowNew(false)} onSave={handleSave} />}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} limitType="entities" />}

      <div className="glass-panel" style={{ minHeight: '60vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}><Users size={22} color="var(--accent-cyan)" /> Directorio de {config.labels.clients}</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
              <Search size={16} color="rgba(255,255,255,0.4)" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Buscar...`} style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '180px', fontFamily: 'inherit' }} />
            </div>
            <button onClick={handleNewClick} className="btn-primary" style={{ margin: 0 }}>
              {entities.length >= FREE_PLAN_LIMIT ? <Lock size={16} /> : <Plus size={16} />} Nuevo
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', color: 'rgba(255,255,255,0.4)' }}>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Cargando desde la nube...
          </div>
        ) : (
          <>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1rem', marginTop: 0 }}>
              {filtered.length} {config.labels.clients.toLowerCase()} encontrados
              {entities.length >= FREE_PLAN_LIMIT && (
                <span style={{ marginLeft: '12px', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
                  🔒 Límite del plan gratuito ({FREE_PLAN_LIMIT}/{FREE_PLAN_LIMIT})
                </span>
              )}
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Nombre', 'Contacto', 'Servicio', 'Estado', 'Registro', ''].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(entity => {
                    const s = statusConfig[entity.status] || statusConfig.active;
                    return (
                      <tr key={entity.id} onClick={() => setSelected(entity)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', flexShrink: 0 }}>{entity.avatar}</div>
                            <span style={{ fontWeight: 600 }}>{entity.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}><div>{entity.email}</div><div style={{ marginTop: '2px' }}>{entity.phone}</div></td>
                        <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{entity.detail}</td>
                        <td style={{ padding: '1rem' }}><span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.label}</span></td>
                        <td style={{ padding: '1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{entity.created_at?.split('T')[0]}</td>
                        <td style={{ padding: '1rem' }}><ChevronRight size={16} color="rgba(255,255,255,0.3)" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
                  <Users size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>No hay {config.labels.clients.toLowerCase()} aún.</p>
                  <p style={{ fontSize: '0.85rem' }}>Haz clic en "Nuevo" para agregar el primero.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </>
  );
}

export default EntityList;
