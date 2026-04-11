import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, ArrowLeft, Shield, Star } from 'lucide-react';

const features = {
  basic: [
    'Hasta 50 clientes / pacientes',
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

function PricingCard({ name, price, features: featureList, highlight, badge }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))' : 'rgba(30,41,59,0.7)',
      border: highlight ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '2.5rem', flex: 1, position: 'relative',
      backdropFilter: 'blur(12px)',
      boxShadow: highlight ? '0 0 40px rgba(99,102,241,0.2)' : 'none',
      transition: 'transform 0.3s ease',
    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
       onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
      
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {featureList.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
            <Check size={16} color="#10b981" style={{ flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 50%), radial-gradient(circle at bottom left, rgba(236,72,153,0.1), transparent 50%), #0f172a',
      padding: '0 2rem 4rem',
    }}>
      {/* Header */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
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

        {/* Tarjetas informativas (decorativas, el pago lo maneja Stripe abajo) */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          <PricingCard name="Plan Básico" price="299" features={features.basic} />
          <PricingCard name="Plan Pro" price="599" features={features.pro} highlight badge />
        </div>

        {/* Stripe Pricing Table embebida */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
            Pago 100% seguro • Procesado por Stripe • SSL cifrado
          </p>
          {/* Widget oficial de Stripe */}
          <stripe-pricing-table
            pricing-table-id="prctbl_1TKmNeRzHRtT8e1b7CUMp6tx"
            publishable-key="pk_test_51TKlBcRzHRtT8e1byh4GMNN27g3iPpEX4MD6gIUFWCYEH7CkYQhQYQVYJcNno1M5FGWXIjJx5UsvWCIQj5dOPDCk00xMl03wSR"
          ></stripe-pricing-table>
        </div>

        {/* Garantías */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {['✅ Sin contrato de permanencia', '🔒 Datos 100% seguros', '📱 Acceso desde cualquier dispositivo', '🆘 Soporte incluido'].map(g => (
            <span key={g} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
