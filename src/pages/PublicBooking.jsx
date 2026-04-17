import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NICHES } from '../config/nicheConfig';

function PublicBooking() {
  const { username } = useParams();
  const { t } = useTranslation();
  const [prof, setProf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Form, 3: Success
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [booking, setBooking] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    const fetchProf = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .eq('public_booking_enabled', true)
          .single();

        if (error || !data) throw new Error(t('booking.error_not_available'));
        setProf(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProf();
  }, [username, t]);

  // Sensor de horarios ocupados
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate || !prof) return;
      setFetchingSlots(true);
      try {
        const { data } = await supabase
          .from('appointments')
          .select('time')
          .eq('user_id', prof.id)
          .eq('full_date', selectedDate);
        
        setBookedSlots(data?.map(d => d.time) || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setFetchingSlots(false);
      }
    };
    fetchBookedSlots();
  }, [selectedDate, prof]);

  const getAvailableHours = (duration = 60) => {
    const slots = [];
    const morningStart = 9;
    const morningEnd = 13;
    const afternoonStart = 16;
    const afternoonEnd = 21;

    const addSlots = (start, end) => {
      for (let h = start; h <= end; h++) {
        const hourStr = h < 10 ? `0${h}` : `${h}`;
        slots.push(`${hourStr}:00`);
        if (duration === 30 && h < end) {
          slots.push(`${hourStr}:30`);
        }
      }
    };

    addSlots(morningStart, morningEnd);
    addSlots(afternoonStart, afternoonEnd);
    return slots;
  };

  const niche = prof ? NICHES[prof.niche || 'medicine'] : null;
  const hours = getAvailableHours(prof?.slot_duration || 60);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      const { data: clash } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', prof.id)
        .eq('full_date', selectedDate)
        .eq('time', selectedTime)
        .single();
      
      if (clash) {
        alert(t('booking.occupied'));
        setBookedSlots([...bookedSlots, selectedTime]);
        setSelectedTime('');
        setStep(1);
        return;
      }

      // Validación de fecha (No permitir pasado)
      const today = new Date();
      today.setHours(0,0,0,0);
      const chosen = new Date(selectedDate + 'T00:00:00');
      if (chosen < today) {
        alert('No es posible agendar citas en fechas que ya pasaron.');
        return;
      }
      
      if (chosen.getDay() === 0) {
        alert(t('booking.sunday_closed'));
        return;
      }

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

      // Notificación para el dueño
      await supabase.from('notifications').insert([{
        user_id: prof.id,
        title: '¡Nueva Reserva Web! 🌐',
        message: `${form.name} ha agendado para el ${selectedDate} a las ${selectedTime}.`,
        type: 'new_booking'
      }]);

      setStep(3);
    } catch (err) {
      alert('Error: ' + err.message);
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
      <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>{t('booking.error_not_available')}</h2>
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
                <Calendar size={20} color="var(--accent-cyan)" /> {t('booking.step1_title')}
              </h3>
              
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.6 }}>{t('booking.label_date')}</label>
              <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate} 
                onChange={e => setSelectedDate(e.target.value)}
                style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', marginBottom: '1.5rem', outline: 'none' }}
              />

              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.6 }}>{t('booking.label_time')}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', position: 'relative' }}>
                {fetchingSlots && <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 10, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader className="animate-spin" size={20}/></div>}
                
                {hours.length > 0 && hours.every(h => bookedSlots.includes(h)) && !fetchingSlots && (
                  <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '2rem', background: 'rgba(239,68,68,0.05)', borderRadius: '12px', border: '1px dashed rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: '0.9rem' }}>
                    {t('booking.no_availability')}
                  </div>
                )}

                {hours.map(h => {
                  const isBooked = bookedSlots.includes(h);
                  return (
                    <button 
                      key={h}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(h)}
                      style={{ 
                        padding: '0.8rem', 
                        borderRadius: '10px', 
                        border: isBooked ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.1)', 
                        background: selectedTime === h ? (niche?.primaryColor || 'var(--accent-cyan)') : (isBooked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'), 
                        color: selectedTime === h ? '#000' : (isBooked ? 'rgba(255,255,255,0.15)' : 'white'), 
                        cursor: isBooked ? 'not-allowed' : 'pointer', 
                        fontWeight: 600, 
                        transition: 'all 0.2s',
                        textDecoration: isBooked ? 'line-through' : 'none',
                        position: 'relative'
                      }}
                    >
                      {h}
                      {isBooked && <span style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>{t('booking.occupied')}</span>}
                    </button>
                  );
                })}
              </div>

              <button 
                disabled={!selectedDate || !selectedTime}
                onClick={() => {
                  const chosen = new Date(selectedDate + 'T00:00:00');
                  if (chosen.getDay() === 0) {
                    alert(t('booking.sunday_closed'));
                    return;
                  }
                  setStep(2);
                }}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '2rem', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
              >
                {t('booking.btn_continue')}
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleBooking}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft size={20}/></button>
                <h3 style={{ margin: 0 }}>{t('booking.step2_title')}</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', opacity: 0.6 }}>{t('booking.label_name')}</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder={t('booking.placeholder_name')} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', opacity: 0.6 }}>{t('booking.label_email')}</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder={t('booking.placeholder_email')} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', opacity: 0.6 }}>{t('booking.label_phone')}</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                    <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder={t('booking.placeholder_phone')} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', marginTop: '1rem', borderLeft: `4px solid ${niche.primaryColor}` }}>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>
                    <Clock size={14} style={{ marginRight: '5px' }} /> 
                    {t('booking.summary', { date: selectedDate, time: selectedTime })}
                  </p>
                </div>

                <button type="submit" disabled={booking} className="btn-primary" style={{ marginTop: '1rem', background: niche.primaryColor, color: '#000' }}>
                  {booking ? t('booking.btn_booking_loading') : t('booking.btn_confirm')}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={60} color="#10b981" style={{ marginBottom: '1.5rem' }} />
              <h2 style={{ marginBottom: '0.5rem' }}>{t('booking.step3_title')}</h2>
              <p style={{ opacity: 0.6, marginBottom: '2rem' }}>
                {t('booking.step3_desc')}
              </p>
              <button onClick={() => setStep(1)} className="btn-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {t('booking.btn_back')}
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
