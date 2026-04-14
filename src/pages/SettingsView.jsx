import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Settings, Building, Phone, Mail, Globe, Save, Check, Upload, Loader, CreditCard, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function SettingsView() {
  const navigate = useNavigate();
  const { config, currentNiche, userProfile } = useOutletContext();
  const isPremium = userProfile?.subscription_status === 'active';
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    businessName: config.appName,
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logoUrl: null,
    username: '',
    publicBookingEnabled: false
  });
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // Al cargar la página, buscar si ya había guardado un perfil
    const loadSettings = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setForm(prev => ({
          ...prev,
          businessName: data.business_name || config.appName,
          ownerName: data.owner_name || '',
          email: data.contact_email || '',
          phone: data.phone || '',
          address: data.address || '',
          website: data.website || '',
          logoUrl: data.logo_url || prev.logoUrl,
          username: data.username || '',
          publicBookingEnabled: data.public_booking_enabled || false
        }));
      }
    };
    loadSettings();
  }, [user, config.appName]);

  const handleLogoUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('branding').getPublicUrl(filePath);
      
      setForm(prev => ({ ...prev, logoUrl: data.publicUrl }));
      
      // Update profile
      await supabase.from('profiles').upsert({ id: user.id, logo_url: data.publicUrl });
      toast.success('Logo actualizado exitosamente');
      
    } catch (error) {
      console.error('Error subiendo logo:', error);
      toast.error('Error al subir imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        business_name: form.businessName,
        owner_name: form.ownerName,
        contact_email: form.email,
        phone: form.phone,
        address: form.address,
        website: form.website,
        logo_url: form.logoUrl,
        username: form.username.toLowerCase().replace(/\s+/g, '-'),
        public_booking_enabled: form.publicBookingEnabled,
        niche: currentNiche
      });
      if (error) {
        if (error.code === '23505') {
          throw new Error('Este nombre de usuario ya está ocupado. Elige otro.');
        }
        throw error;
      }
      setSaved(true);
      toast.success('Configuración guardada en la nube');
      setTimeout(() => {
        setSaved(false);
        window.location.reload(); // Recarga la página para bloquear el selector de nicho instantáneamente
      }, 1500);
    } catch (error) {
      toast.error('Error guardando configuración: ' + error.message);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
    color: 'white', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem' }}>
      {/* Formulario principal */}
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1.5rem' }}>
          <Settings size={22} color="var(--accent-cyan)" /> Configuración del Negocio
        </h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre del Negocio</label>
              <input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} placeholder={config.appName} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre del Titular</label>
              <input value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} placeholder="Dr. / Lic. / Coach..." style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo de Contacto</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contacto@clinica.com" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teléfono Oficina</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="(555) 000-0000" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dirección</label>
            <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Av. Principal #100, Ciudad" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sitio Web</label>
            <input value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://miclinica.com" style={inputStyle} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'fit-content', marginTop: '0.5rem', background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : undefined }}>
            {saved ? <><Check size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
          </button>
        </form>

        {/* Nueva Sección: Presencia Web */}
        <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="var(--accent-cyan)" /> Presencia Web ProNexusGlobal
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Personaliza tu link único para que tus clientes puedan agendarse de forma autónoma.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>URL DE AGENDAMIENTO</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white', fontSize: '0.9rem' }}>
                  <span style={{ opacity: 0.4 }}>pronexus.app/u/</span>
                  <input 
                    value={form.username} 
                    onChange={e => setForm({...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                    placeholder="tu-nombre" 
                    style={{ ...inputStyle, width: 'auto', padding: '0px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', borderRadius: 0 }} 
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/u/${form.username}`;
                  navigator.clipboard.writeText(url);
                  toast.success('¡Link copiado al portapapeles!');
                }}
                disabled={!form.username}
                className="btn-primary" 
                style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ExternalLink size={16} /> Copiar Link
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem' }}>Estado de la Web Pública</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Permitir que clientes agenden sin login</p>
              </div>
              <div 
                onClick={() => setForm({...form, publicBookingEnabled: !form.publicBookingEnabled})}
                style={{ width: '50px', height: '26px', background: form.publicBookingEnabled ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
              >
                <div style={{ position: 'absolute', top: '3px', left: form.publicBookingEnabled ? '27px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'left 0.3s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel info del nicho */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ width: 90, height: 90, borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: '0 0 30px rgba(99,102,241,0.1)', overflow: 'hidden', position: 'relative' }}>
            {form.logoUrl ? (
              <img src={form.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Building size={32} color="rgba(255,255,255,0.2)" />
            )}
            
            {/* Input oculto para subir */}
            <label style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', opacity: uploading ? 1 : 0, cursor: 'pointer', transition: 'opacity 0.2s', ...(!uploading && { ':hover': { opacity: 1 } }) }}
              onMouseEnter={e => !uploading && (e.currentTarget.style.opacity = 1)}
              onMouseLeave={e => !uploading && (e.currentTarget.style.opacity = 0)}
            >
              {uploading ? <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={24} />}
              <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '-0.5rem', marginBottom: '1.5rem' }}>PNG o JPG (máx. 2MB)</p>

          <h3 style={{ margin: '0 0 0.5rem' }}>{form.businessName || config.appName}</h3>
          <p style={{ color: isPremium ? '#10b981' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0, fontWeight: isPremium ? 700 : 400 }}>
            {isPremium && userProfile?.plan_type === 'pro' ? '✦ Plan Pro (Ilimitado)' : isPremium && userProfile?.plan_type === 'basic' ? '✦ Plan Básico (50)' : 'Plan Gratuito'}
          </p>
          <div style={{ margin: '1.2rem 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{config.labels.clients}</span>
              <span style={{ fontWeight: 600, color: isPremium ? '#10b981' : 'white' }}>
                {isPremium && userProfile?.plan_type === 'pro' ? 'Ilimitados' : isPremium && userProfile?.plan_type === 'basic' ? 'Límite de 50' : 'Límite de 8'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Usuarios</span>
              <span style={{ fontWeight: 600 }}>1/5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Renovación</span>
              <span style={{ fontWeight: 600, color: '#10b981' }}>Mayo 2025</span>
            </div>
          </div>
          <button 
            onClick={() => isPremium ? window.open('https://billing.stripe.com/p/login/test_6oE14Uf4U2q26He6oo', '_blank') : navigate('/pricing')}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: isPremium ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--accent-cyan)', background: isPremium ? 'rgba(255,255,255,0.05)' : 'rgba(6,182,212,0.08)', color: isPremium ? 'white' : 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.2s' }}
          >
            {isPremium ? 'Gestionar Facturación 💳' : 'Mejorar Plan ✦'}
          </button>


        </div>
      </div>
    </div>
  );
}

export default SettingsView;
