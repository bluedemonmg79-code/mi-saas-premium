import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updatePassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al actualizar contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.15), transparent 40%), #0f172a'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3rem 2.5rem', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '15px', borderRadius: '50%', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
            <Lock size={32} color="white" />
          </div>
        </div>

        <h2 style={{ marginBottom: '0.4rem', fontSize: '1.8rem' }}>Nueva Contraseña</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {success ? '¡Actualizada correctamente!' : 'Ingresa tu nueva contraseña para acceder.'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '0.88rem', textAlign: 'left' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {success ? (
          <div>
             <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle size={20} /> Ahora puedes ingresar a tu cuenta.
             </div>
             <button onClick={() => navigate('/login')} style={{
                width: '100%', padding: '1rem', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)', color: 'white', fontWeight: 700, cursor: 'pointer',
                fontSize: '1rem', transition: 'all 0.2s'
              }}>
                Ir al Inicio de Sesión
              </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Nueva Contraseña</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} style={{
                width: '100%', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '0.95rem'
              }} />
            </div>
            
            <button type="submit" disabled={loading} style={{
              padding: '1rem', borderRadius: '10px', border: 'none',
              background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: 'white', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem', fontSize: '1rem', transition: 'all 0.2s'
            }}>
              {loading ? '⏳ Guardando...' : 'Guardar y Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default UpdatePassword;
