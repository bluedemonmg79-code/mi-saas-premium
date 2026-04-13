import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { CalendarCheck, Plus, X, Clock, Loader, Trash2, Edit2, MessageCircle, Globe, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function NewAppointmentModal({ dayIndex, config, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', detail: '', notes: '', time: '09:00' });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ ...form, day: dayIndex });
    setSaving(false);
    onClose();
  };
  const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'white', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', width: '420px', position: 'relative' }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', padding: '6px', display: 'flex' }}><X size={18} /></button>
        <h2 style={{ marginBottom: '1.5rem' }}>Nueva {config.labels.appointments.replace(/s$/, '')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div><label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Nombre *</label><input required placeholder="Ej. María García" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} /></div>
          <div><label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Hora *</label>
            <select required value={form.time} onChange={e => setForm({...form, time: e.target.value})} style={{...inputStyle, cursor: 'pointer'}}>
              {HOURS.map(h => <option key={h} value={h} style={{ background: '#1e293b' }}>{h}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Motivo / Servicio</label>
            <input placeholder="Ej. Primera consulta" value={form.detail} onChange={e => setForm({...form, detail: e.target.value})} list="calendar-catalog-list" style={inputStyle} />
            <datalist id="calendar-catalog-list">
              {config.catalog?.map((item, idx) => <option key={idx} value={item} />)}
            </datalist>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Notas Internas</label>
            <textarea placeholder="Ej. Alérgico a algo, traer estudios..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} style={{ ...inputStyle, minHeight: '80px', resize: 'none' }} />
          </div>
          <button type="submit" disabled={saving} style={{ marginTop: '0.5rem', padding: '0.9rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', color: '#0f172a', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', fontSize: '1rem' }}>
            {saving ? '⏳ Guardando...' : 'Agendar'}
          </button>
        </form>
      </div>
    </div>
  );
}

function CalendarView() {
  const { config, currentNiche } = useOutletContext();
  const { user } = useAuth();
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', detail: '', notes: '', time: '09:00' });
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowNew(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .eq('niche', currentNiche)
      .order('time', { ascending: true });
    if (!error) setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAppointments(); }, [currentNiche]);

  const handleSave = async ({ name, detail, notes, time, day }) => {
    const { error } = await supabase.from('appointments').insert([{
      user_id: user.id, niche: currentNiche,
      name, detail, notes, time, day, status: 'confirmed'
    }]);
    if (!error) {
      toast.success('Cita agendada correctamente');
      fetchAppointments();
    } else {
      toast.error('Error agendando cita');
    }
  };

  const handleUpdate = async (id, form) => {
    const { error } = await supabase.from('appointments').update(form).eq('id', id);
    if (!error) {
      toast.success('Cita actualizada');
      fetchAppointments();
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('¿Eliminar cita de forma permanente?')) return;
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (!error) {
      toast.success('Cita eliminada');
      fetchAppointments();
    }
  };

  const dayAppointments = appointments.filter(a => a.day === selectedDay);

  const openWhatsApp = () => {
    // In a real app we would have the entity's phone linked in the appointment, but for now we'll just open WhatsApp Web
    const message = encodeURIComponent(`Hola ${showEdit.name}, le escribimos de ${config.appName} para recordarle su cita de ${showEdit.detail} a las ${showEdit.time}. ¡Saludos!`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <>
      {showNew && <NewAppointmentModal dayIndex={selectedDay} config={config} onClose={() => setShowNew(false)} onSave={handleSave} />}
      {showEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setShowEdit(null)}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', width: '420px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowEdit(null)} style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '8px', padding: '6px', display: 'flex' }}><X size={18} /></button>
            <h2 style={{ marginBottom: '0.5rem', marginTop: 0 }}>Gestionar Cita</h2>
            
            {isEditing ? (
              <form onSubmit={async (e) => { 
                e.preventDefault(); 
                await handleUpdate(showEdit.id, editForm); 
                setIsEditing(false); 
                setShowEdit({ ...showEdit, ...editForm }); 
              }} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Nombre" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'white', outline: 'none' }} />
                <select value={editForm.time} onChange={e => setEditForm({...editForm, time: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,1)', color: 'white', outline: 'none' }}>
                  {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <input value={editForm.detail} onChange={e => setEditForm({...editForm, detail: e.target.value})} placeholder="Servicio" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'white', outline: 'none' }} />
                <textarea value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} placeholder="Notas" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.25)', color: 'white', outline: 'none', minHeight: '60px' }} />
                <button type="submit" className="btn-primary" style={{ padding: '0.8rem', justifyContent: 'center' }}>Guardar Cambios</button>
                <button type="button" onClick={() => setIsEditing(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem' }}>Cancelar edición</button>
              </form>
            ) : (
              <>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', marginTop: '1rem' }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{showEdit.name}</p>
                  <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.6)' }}>{showEdit.detail} — a las {showEdit.time}</p>
                  {showEdit.notes && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: '1.4' }}>
                      <strong>Notas:</strong> {showEdit.notes}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <button onClick={openWhatsApp} style={{ flex: '1 1 100%', padding: '0.8rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <MessageCircle size={18} /> Recordatorio WhatsApp
                  </button>
                  {showEdit.status === 'pending' && (
                    <button 
                      onClick={async () => {
                        await handleUpdate(showEdit.id, { status: 'confirmed' });
                        setShowEdit({ ...showEdit, status: 'confirmed' });
                      }}
                      style={{ flex: '1 1 100%', padding: '0.8rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <CheckCircle size={18} /> Confirmar Cita ⚡
                    </button>
                  )}
                  <button onClick={() => { setEditForm({ name: showEdit.name, detail: showEdit.detail, notes: showEdit.notes || '', time: showEdit.time }); setIsEditing(true); }} style={{ flex: '1', padding: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Edit2 size={16} /> Editar
                  </button>
                  <button onClick={() => { handleDelete(showEdit.id); setShowEdit(null); }} style={{ flex: '1', padding: '0.8rem', borderRadius: '10px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Trash2 size={16} /> Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Calendario de semana */}
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}><CalendarCheck size={22} color="var(--accent-purple)" /> {config.labels.agendaT}</h2>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Semana del 7–13 Abr, 2025</span>
          </div>

          {/* Selector de días */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '1rem' }}>
            {DAYS.map((day, i) => (
              <button key={day} onClick={() => setSelectedDay(i)} style={{
                padding: '12px 8px', border: 'none', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                background: selectedDay === i ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.04)',
                color: selectedDay === i ? '#0f172a' : 'rgba(255,255,255,0.7)',
                fontWeight: selectedDay === i ? 700 : 400, fontFamily: 'inherit'
              }}>
                <div style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{day}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{7 + i}</div>
                {appointments.filter(a => a.day === i).length > 0 && (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: selectedDay === i ? '#0f172a' : 'var(--accent-cyan)', margin: '4px auto 0' }} />
                )}
              </button>
            ))}
          </div>

          {/* Bloques horarios */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[1,2,3,4,5].map(idx => (
                <div key={idx} style={{ height: '52px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', animation: 'pulse 1.5s infinite alternate' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {HOURS.map(hour => {
                const appt = dayAppointments.find(a => a.time === hour);
                return (
                  <div key={hour} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', minHeight: '52px', background: appt ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)', border: appt ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => !appt && (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => !appt && (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onClick={() => appt ? setShowEdit(appt) : setShowNew(true)}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', width: '45px', flexShrink: 0 }}>{hour}</span>
                    {appt ? (
                      <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        ...(appt.origin === 'web' && appt.status === 'pending' && {
                          borderLeft: '3px solid #f59e0b',
                          paddingLeft: '10px',
                          marginLeft: '-10px'
                        })
                      }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {appt.name} {appt.origin === 'web' && <Globe size={12} title="Desde Web" color="#f59e0b" />}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{appt.detail}</p>
                        </div>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: appt.status === 'confirmed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: appt.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>
                          {appt.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.82rem' }}>— clic para agendar</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
              <Clock size={18} color="var(--accent-cyan)" /> {DAYS[selectedDay]} 7 Abril
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loading ? (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>Cargando...</p>
              ) : dayAppointments.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>Sin citas agendadas</p>
              ) : dayAppointments.map(a => (
                <div key={a.id} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.75rem' }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '0.9rem' }}>{a.name}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>{a.time} — {a.detail}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setShowNew(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
            <Plus size={18} /> Nueva {config.labels.appointments.replace(/s$/, '')}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse { from { opacity: 0.3 } to { opacity: 0.7 } }
      `}</style>
    </>
  );
}

export default CalendarView;
