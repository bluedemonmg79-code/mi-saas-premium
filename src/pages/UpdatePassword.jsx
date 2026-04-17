import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updatePassword(password);
      toast.success('Contraseña actualizada exitosamente. Redirigiendo...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      toast.error(err.message || 'Error al actualizar la contraseña.');
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
          Ingresa tu nueva contraseña para acceder.
        </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Nueva Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  minLength={6} 
                  style={{
                    width: '100%', padding: '0.8rem 1rem', paddingRight: '2.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', fontSize: '0.95rem'
                  }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '5px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
      </div>
    </div>
  );
}

export default UpdatePassword;
