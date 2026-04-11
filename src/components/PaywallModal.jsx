import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, X } from 'lucide-react';

/**
 * Modal que aparece cuando un usuario Free intenta usar una función Premium.
 * Se activa cuando supera el límite del plan gratuito.
 */
function PaywallModal({ onClose, limitType = 'entities' }) {
  const navigate = useNavigate();

  const messages = {
    entities: {
      title: 'Límite del Plan Gratuito',
      description: 'Has alcanzado el máximo de 3 registros en el Plan Básico gratuito.',
      feature: 'registros ilimitados',
    },
    appointments: {
      title: 'Límite del Plan Gratuito',
      description: 'Has alcanzado el máximo de citas en el Plan Gratuito.',
      feature: 'agenda sin límites',
    },
  };

  const msg = messages[limitType] || messages.entities;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: '24px', padding: '3rem 2.5rem',
          width: '420px', textAlign: 'center', position: 'relative',
          boxShadow: '0 0 60px rgba(99,102,241,0.2)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.2rem', right: '1.2rem',
            background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white',
            cursor: 'pointer', borderRadius: '8px', padding: '6px', display: 'flex',
          }}
        >
          <X size={18} />
        </button>

        {/* Ícono */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))',
          border: '1px solid rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={30} color="#a5b4fc" />
        </div>

        <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>{msg.title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          {msg.description}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', fontSize: '0.875rem' }}>
          Mejora tu plan para obtener <strong style={{ color: '#a5b4fc' }}>{msg.feature}</strong> y todas las funciones Premium.
        </p>

        {/* Beneficios rápidos */}
        <div style={{
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '12px', padding: '1rem', marginBottom: '2rem', textAlign: 'left',
        }}>
          {['✅ Clientes ilimitados', '✅ Agenda sin restricciones', '✅ Soporte prioritario 24/7', '✅ Múltiples usuarios'].map(f => (
            <p key={f} style={{ margin: '0.35rem 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{f}</p>
          ))}
        </div>

        <button
          onClick={() => { onClose(); navigate('/pricing'); }}
          style={{
            width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Zap size={18} /> Ver Planes y Suscribirse
        </button>

        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
          Sin contratos • Cancela cuando quieras
        </p>
      </div>
    </div>
  );
}

export default PaywallModal;
