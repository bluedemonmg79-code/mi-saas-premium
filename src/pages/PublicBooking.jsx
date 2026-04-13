import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NICHES } from '../config/nicheConfig';

function PublicBooking() {
  const { username } = useParams();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Form, 3: Success
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .eq('public_booking_enabled', true)
          .single();

        if (error || !data) throw new Error('Este profesional no tiene habilitado el agendamiento público o no existe.');
        setProf(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProf();
  }, [username]);

  const niche = prof ? NICHES[prof.niche || 'medicine'] : null;

  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00'];

  const handleBooking = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      // Calcular índice de día (0: Lun, ..., 6: Dom)
      // getUTCDay() da 0 para Domingo, 1 para Lunes...
      const dateObj = new Date(selectedDate + 'T00:00:00');
      const dayIndex = (dateObj.getDay() + 6) % 7;

      const { error } = await supabase.from('appointments').insert({
        user_id: prof.id,
        niche: prof.niche,
        name: form.name,
        email: form.email,
        phone: form.phone,
        day: dayIndex,
        full_date: selectedDate,
        time: selectedTime,
        status: 'pending',
        origin: 'web'
      });
      if (error) throw error;
      setStep(3);
    } catch (err) {
      alert('Error al agendar: ' + err.message);
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
      <Loader className="animate-spin" size={40} color="var(--accent-cyan)" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white', padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Página no disponible</h2>
      <p style={{ opacity: 0.6 }}>{error}</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Header con Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: 80, height: 80, borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden' }}>
            {prof.logo_url ? <img src={prof.logo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={30} />}
          </div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.2rem' }}>{prof.business_name || niche.appName}</h1>
          <p style={{ color: niche.primaryColor, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {niche.labels.appointments}
          </p>
        </div>

        {/* Card Principal */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', position: 'relative' }}>
          
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={20} color="var(--accent-cyan)" /> Selecciona Fecha y Hora
              </h3>
              
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.6 }}>Fecha</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', marginBottom: '1.5rem', outline: 'none' }}
              />

              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.6 }}>Horarios Disponibles</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {hours.map(h => (
                  <button 
                    key={h}
                    onClick={() => setSelectedTime(h)}
                    style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: selectedTime === h ? niche.primaryColor : 'rgba(255,255,255,0.05)', color: selectedTime === h ? '#000' : 'white', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '2rem', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleBooking}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft size={20}/></button>
                <h3 style={{ margin: 0 }}>Completa tus Datos</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', opacity: 0.6 }}>Nombre Completo</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej. Juan Pérez" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', opacity: 0.6 }}>Correo Electrónico</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="juan@ejemplo.com" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', opacity: 0.6 }}>Teléfono de Contacto</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="55 1234 5678" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', marginTop: '1rem', borderLeft: `4px solid ${niche.primaryColor}` }}>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>
                    <Clock size={14} style={{ marginRight: '5px' }} /> 
                    Reserva para el <strong>{selectedDate}</strong> a las <strong>{selectedTime}</strong>
                  </p>
                </div>

                <button type="submit" disabled={booking} className="btn-primary" style={{ marginTop: '1rem', background: niche.primaryColor, color: '#000' }}>
                  {booking ? 'Agendando...' : 'Confirmar Solicitud'}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={60} color="#10b981" style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ marginBottom: '0.5rem' }}>¡Solicitud Enviada!</h2>
              <p style={{ opacity: 0.6, marginBottom: '2rem' }}>
                Tu cita ha sido registrada. El profesional revisará tu solicitud y se pondrá en contacto contigo pronto.
              </p>
              <button onClick={() => setStep(1)} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Regresar
              </button>
            </div>
          )}

        </div>

        <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', opacity: 0.3 }}>
          Powered by <strong>ProNexusGlobal</strong>
        </p>

      </div>
    </div>
  );
}

export default PublicBooking;
