import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, ArrowLeft, Shield, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const PRICE_BASIC = 'price_1TKmAWRzHRtT8e1bzEtj0NMW';
const PRICE_PRO   = 'price_1TKmBxRzHRtT8e1bK6zXQaeC';

const features = {
  basic: [
    'Hasta 100 clientes / pacientes',
    'Agenda de citas completa',
    'Panel de estadísticas',
    'Gráficas de ingresos',
    'Soporte por correo',
    '1 usuario por cuenta',
  ],
  pro: [
    'Clientes ilimitados',
    'Todo lo del Plan Básico',
    'Hasta 5 usuarios simultáneos',
    'Reportes avanzados de ingresos',
    'Exportación de datos (CSV)',
    'Soporte prioritario 24/7',
    'Acceso anticipado a nuevas funciones',
  ],
};

function PricingCard({ name, price, features: featureList, highlight, badge, onSubscribe, loading }) {
  return (
    <div style={{
      background: highlight
        ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.2))'
        : 'rgba(30,41,59,0.7)',
      border: highlight ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '2.5rem', flex: 1, position: 'relative',
      backdropFilter: 'blur(12px)',
      boxShadow: highlight ? '0 0 50px rgba(99,102,241,0.25)' : 'none',
      transition: 'transform 0.3s ease',
      display: 'flex', flexDirection: 'column',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {badge && (
        <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '4px 20px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap' }}>
          ⭐ MÁS POPULAR
        </div>
      )}

      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{name}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2rem' }}>
        <span style={{ fontSize: '2.8rem', fontWeight: 800 }}>${price}</span>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>MXN / mes</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
        {featureList.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{f}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSubscribe}
        disabled={loading}
        style={{
          width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
          background: highlight
            ? 'linear-gradient(135deg, #6366f1, #a855f7)'
            : 'rgba(255,255,255,0.08)',
          color: 'white', fontSize: '1rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit', transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: highlight ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
        }}
      >
        {loading ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Redirigiendo...</> : `Activar ${name}`}
      </button>
    </div>
  );
}

function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleSubscribe = async (priceId, planName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoadingPlan(planName);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          userId: user.id,
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      alert('Error al iniciar el pago: ' + err.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(236,72,153,0.1), transparent 50%), #0f172a',
      padding: '0 2rem 4rem',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '2rem 0', marginBottom: '1rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', borderRadius: '10px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit', fontSize: '0.9rem', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            <ArrowLeft size={16} /> Regresar
          </button>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', padding: '6px 16px', borderRadius: '20px', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#a5b4fc' }}>
            <Zap size={14} /> Prueba 14 días gratis — sin tarjeta de crédito
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>
            Elige el plan<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              perfecto para ti
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Software profesional de gestión para tu clínica, despacho o negocio. Sin contratos. Cancela cuando quieras.
          </p>
        </div>

        {/* Tarjetas con botones de pago integrados */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <PricingCard
            name="Plan Básico"
            price="299"
            features={features.basic}
            loading={loadingPlan === 'basic'}
            onSubscribe={() => handleSubscribe(PRICE_BASIC, 'basic')}
          />
          <PricingCard
            name="Plan Pro"
            price="599"
            features={features.pro}
            highlight
            badge
            loading={loadingPlan === 'pro'}
            onSubscribe={() => handleSubscribe(PRICE_PRO, 'pro')}
          />
        </div>

        {/* Garantías */}
        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Shield size={14} style={{ color: '#10b981', verticalAlign: 'middle' }} />
            {['✅ Sin contrato de permanencia', '🔒 Datos 100% seguros', '📱 Acceso desde cualquier dispositivo', '🆘 Soporte incluido'].map(g => (
              <span key={g} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{g}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Pricing;
