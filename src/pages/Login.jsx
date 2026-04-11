import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, Rocket, UserPlus } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register, resetPassword } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        await resetPassword(email);
        toast.success('Si el correo existe, te hemos enviado un enlace para restablecer tu contraseña.');
        setIsForgot(false);
      } else if (isRegister) {
        await register(email, password);
        toast.success('¡Cuenta creada! Revisa tu correo para confirmar tu cuenta, luego inicia sesión.');
        setIsRegister(false);
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      const messages = {
        'Invalid login credentials': 'Correo o contraseña incorrectos.',
        'Email not confirmed': 'Confirma tu correo electrónico antes de entrar.',
        'User already registered': 'Este correo ya tiene una cuenta. Inicia sesión.',
        'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
      };
      toast.error(messages[err.message] || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem', borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)',
    color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
    fontSize: '0.95rem'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.15), transparent 40%), #0f172a'
    }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '3rem 2.5rem', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '15px', borderRadius: '50%', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
            {isRegister ? <UserPlus size={32} color="white" /> : <ShieldCheck size={32} color="white" />}
          </div>
        </div>

        <h2 style={{ marginBottom: '0.4rem', fontSize: '1.8rem' }}>
          {isForgot ? 'Recuperar Clave' : (isRegister ? 'Crear Cuenta' : 'Bienvenido')}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {isForgot 
            ? 'Ingresa tu correo y te enviaremos un enlace seguro.' 
            : (isRegister ? 'Regístrate para empezar tu prueba.' : 'Inicia sesión para gestionar tu negocio.')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Correo Electrónico</label>
            <input type="email" required placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          
          {!isForgot && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Contraseña</label>
                {!isRegister && (
                  <button type="button" onClick={() => { setIsForgot(true); }} style={{ background: 'none', border: 'none', color: '#a5b4fc', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}>
                    ¿Olvidaste tu clave?
                  </button>
                )}
              </div>
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>
          )}
          
          <button type="submit" disabled={loading} style={{
            padding: '1rem', borderRadius: '10px', border: 'none',
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6366f1, #ec4899)',
            color: 'white', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem', transition: 'all 0.2s'
          }}>
            {loading ? '⏳ Procesando...' : isForgot ? 'Enviar Enlace' : (isRegister ? <><UserPlus size={18} /> Crear Cuenta</> : <><Rocket size={18} /> Entrar al Sistema</>)}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)' }}>
          {isForgot 
            ? 'Regresar al ' 
            : (isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?')}
          <button onClick={() => { setIsRegister(!isRegister); setIsForgot(false); }}
            style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem', marginLeft: '4px' }}>
            {isForgot ? 'inicio de sesión' : (isRegister ? 'Inicia sesión' : 'Regístrate aquí')}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
