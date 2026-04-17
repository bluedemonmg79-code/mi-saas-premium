import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Settings, Building, Phone, Mail, Globe, Save, Check, Upload, Loader, Users, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const NICHES = {
  health: { appName: 'ClinicaCare', primaryColor: '#0ea5e9' },
  medicine: { appName: 'VitaCare', primaryColor: '#10b981' },
  legal: { appName: 'LexManager', primaryColor: '#6366f1' },
  fitness: { appName: 'FitPro', primaryColor: '#f43f5e' },
  realestate: { appName: 'HomeFlow', primaryColor: '#8b5cf6' }
};

function SettingsView() {
  const { config, currentNiche, userProfile, fetchProfile, userRole, ownerId } = useOutletContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    businessName: userProfile?.business_name || '',
    email: userProfile?.contact_email || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    niche: userProfile?.niche || currentNiche,
    username: userProfile?.username || '',
    publicBookingEnabled: userProfile?.public_booking_enabled || false,
    logoUrl: userProfile?.logo_url || null,
    slotDuration: userProfile?.slot_duration || 60
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingBilling, setLoadingBilling] = useState(false);

  const isPremium = userProfile?.subscription_status === 'active';

  // Sincronizar form con perfil si cambia
  useEffect(() => {
    if (userProfile) {
      setForm({
        businessName: userProfile.business_name || '',
        email: userProfile.contact_email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        niche: userProfile.niche || currentNiche,
        username: userProfile.username || '',
        publicBookingEnabled: userProfile.public_booking_enabled || false,
        logoUrl: userProfile.logo_url || null,
        slotDuration: userProfile.slot_duration || 60
      });
    }
  }, [userProfile]);

  const fetchTeamMembers = async () => {
    if (userRole !== 'owner') return;
    const { data } = await supabase.from('team_members').select('*').eq('owner_id', user.id);
    setTeamMembers(data || []);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [user, userRole]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      business_name: form.businessName,
      contact_email: form.email,
      phone: form.phone,
      address: form.address,
      niche: form.niche,
      username: form.username.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      public_booking_enabled: form.publicBookingEnabled,
      logo_url: form.logoUrl,
      slot_duration: parseInt(form.slotDuration)
    }).eq('id', user.id);

    if (!error) {
      toast.success('Configuración guardada correctamente');
      fetchProfile();
    } else {
      toast.error('Error al guardar: ' + error.message);
    }
    setSaving(false);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (teamMembers.length >= 4) {
      toast.error('Límite de 4 colaboradores alcanzado.');
      return;
    }
    setLoadingTeam(true);
    const { error } = await supabase.from('team_members').insert([
      { owner_id: user.id, member_email: newMemberEmail.toLowerCase().trim() }
    ]);
    if (!error) {
      toast.success('Colaborador invitado');
      setNewMemberEmail('');
      fetchTeamMembers();
    } else {
      toast.error('Error: ' + error.message);
    }
    setLoadingTeam(false);
  };

  const removeMember = async (id) => {
    if (!window.confirm('¿Revocar acceso?')) return;
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (!error) {
      toast.success('Acceso revocado');
      fetchTeamMembers();
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(`logos/${fileName}`, file);
    if (uploadError) {
      toast.error('Error subiendo logo');
    } else {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`logos/${fileName}`);
      setForm({ ...form, logoUrl: publicUrl });
      toast.success('Logo cargado');
    }
    setUploading(false);
  };

  const handleBilling = async () => {
    setLoadingBilling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('https://iwdqybisydagwyahzxyl.supabase.co/functions/v1/debug-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ email: user.email })
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else toast.error('Error en portal de facturación');
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setLoadingBilling(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Formulario de Perfil */}
        <form onSubmit={handleSave} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings color="var(--accent-cyan)" /> Configuración
            </h2>
            {userRole === 'owner' && (
              <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                {saving ? <Loader size={18} className="spin" /> : <><Save size={18} /> Guardar</>}
              </button>
            )}
          </div>
          {userRole === 'member' && (
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.8rem', borderRadius: '10px', color: '#f59e0b', fontSize: '0.85rem' }}>
              Modo visualización: Solo el administrador puede modificar estos datos.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Nombre Comercial</label><input disabled={userRole === 'member'} value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} style={{ ...inputStyle, opacity: userRole === 'member' ? 0.6 : 1 }} /></div>
            <div><label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Email de Contacto</label><input disabled={userRole === 'member'} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ ...inputStyle, opacity: userRole === 'member' ? 0.6 : 1 }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div><label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Teléfono</label><input disabled={userRole === 'member'} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ ...inputStyle, opacity: userRole === 'member' ? 0.6 : 1 }} /></div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Nicho de Negocio</label>
              <select disabled={userRole === 'member'} value={form.niche} onChange={e => setForm({...form, niche: e.target.value})} style={{ ...inputStyle, opacity: userRole === 'member' ? 0.6 : 1 }}>
                {Object.keys(NICHES).map(n => <option key={n} value={n}>{NICHES[n].appName}</option>)}
              </select>
            </div>
          </div>
          <div><label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>Dirección Física</label><input disabled={userRole === 'member'} value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{ ...inputStyle, opacity: userRole === 'member' ? 0.6 : 1 }} /></div>

          {/* Selector de Duración de Citas */}
          <div style={{ marginTop: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Duración de Cita (Bloques)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[30, 60].map(duration => (
                <div 
                  key={duration}
                  onClick={() => setForm({...form, slotDuration: duration})}
                  style={{
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: form.slotDuration === duration ? '2px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                    background: form.slotDuration === duration ? 'rgba(99,102,241,0.1)' : 'rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: form.slotDuration === duration ? 'var(--accent-cyan)' : 'white' }}>{duration} min</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                    {duration === 30 ? 'Citas rápidas' : 'Citas estándar'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Gestión de Equipo: Visible para cuentas Pro activas */}
        {isPremium && userProfile?.plan_type === 'pro' && (
          <div className="glass-panel" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
            <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={20} color="#10b981" /> Equipo Pro</h3>
            <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
              <input type="email" required placeholder="email@colaborador.com" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button disabled={loadingTeam} type="submit" className="btn-primary" style={{ padding: '0 1.2rem', background: '#10b981' }}>{loadingTeam ? <Loader size={18} className="spin" /> : 'Invitar'}</button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {teamMembers.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 1rem', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.9rem' }}>{m.member_email}</span>
                  <button onClick={() => removeMember(m.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presencia Web */}
        <div className="glass-panel">
          <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Globe size={20} color="var(--accent-cyan)" /> Link de Agendamiento</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', color: 'white' }}>pronexus.app/u/<input value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={{ background: 'transparent', border: 'none', borderBottom: '1px solid #334155', color: 'var(--accent-cyan)', width: '120px', marginLeft: '5px', outline: 'none' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/u/${form.username}`); toast.success('Link copiado'); }} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Copiar</button>
              <button 
                onClick={() => {
                  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                  const baseUrl = isLocal ? 'https://pronexus.app' : window.location.origin; // Sustituye https://pronexus.app por tu dominio real
                  const url = `${baseUrl}/u/${form.username}`;
                  const text = encodeURIComponent(`Hola, puedes agendar tu cita conmigo aquí: ${url}`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="btn-primary" 
                style={{ background: '#25D366', color: 'white', padding: '0.5rem 1rem', fontSize: '0.8rem', border: 'none' }}
              >
                WhatsApp 📱
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Lateral Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '15px', background: 'rgba(255,255,255,0.05)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', border: '1px dashed rgba(255,255,255,0.2)' }}>
            {form.logoUrl ? <img src={form.logoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Building size={30} opacity={0.3} />}
            <label style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
              <Upload size={20} />
              <input type="file" onChange={handleLogoUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <h3 style={{ margin: 0 }}>{form.businessName || 'Mi Negocio'}</h3>
          <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, margin: '5px 0 1.5rem' }}>{isPremium ? '✦ PLAN PRO ACTIVO' : 'PLAN GRATUITO'}</p>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', textAlign: 'left', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ opacity: 0.5 }}>Pacientes</span>
               <span style={{ color: isPremium ? '#10b981' : 'white', fontWeight: 600 }}>
                 {userProfile?.plan_type === 'pro' ? 'Ilimitados' : userProfile?.plan_type === 'basic' ? 'Máx. 100' : 'Máx. 20'}
               </span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <span style={{ opacity: 0.5 }}>Equipo</span>
               <span style={{ fontWeight: 600 }}>
                 {teamMembers.length + 1} de {userProfile?.plan_type === 'pro' ? '5' : '1'}
               </span>
             </div>
          </div>
          
          <button onClick={handleBilling} disabled={loadingBilling} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>
            {loadingBilling ? 'Conectando...' : 'Facturación y Pagos 💳'}
          </button>
        </div>
      </div>
      <style>{`.spin { animation: spin 1s linear infinite } @keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default SettingsView;
