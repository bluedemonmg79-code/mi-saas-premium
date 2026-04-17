import React, { useState, useEffect } from 'react';
import { X, Send, History, Calendar, FileText, User, Phone, MessageCircle, ArrowLeft, Loader, Trash2, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function PatientDetailView({ entity, onClose, config }) {
  const { user } = useAuth();
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'appointments'

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // 1. Cargar Notas Médicas
      const { data: notesData, error: notesError } = await supabase
        .from('medical_notes')
        .select('*')
        .eq('entity_id', entity.id)
        .order('created_at', { ascending: false });
      
      if (!notesError) setNotes(notesData || []);

      // 2. Cargar Citas relacionadas
      const { data: apptData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'confirmed')
        .eq('name', entity.name) // Referencia por nombre por ahora si no hay link directo
        .order('time', { ascending: false });
      
      if (!apptError) setAppointments(apptData || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [entity.id]);

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) {
      toast.error('La nota no puede estar vacía');
      return;
    }
    setSaving(true);
    
    try {
      const { error } = await supabase.from('medical_notes').insert([{
        entity_id: entity.id,
        owner_id: entity.user_id, // El owner es el dueño del registro
        created_by: user.id,
        content: newNote.trim()
      }]);

      if (!error) {
        toast.success('Nota guardada');
        setNewNote('');
        fetchHistory();
      } else {
        toast.error('Error al guardar nota');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if(!window.confirm('¿Eliminar esta nota del historial?')) return;
    const { error } = await supabase.from('medical_notes').delete().eq('id', id);
    if (!error) {
      toast.success('Nota eliminada');
      fetchHistory();
    }
  };

  const openWhatsApp = () => {
    const cleanPhone = entity.phone?.replace(/\D/g, '');
    if (!cleanPhone) return toast.error('Sin teléfono');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.95)', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30,41,59,0.5)', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', padding: '8px', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{entity.name}</h2>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{config.labels.historyTitle}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={openWhatsApp} className="btn-secondary" style={{ padding: '0.6rem 1rem', background: '#10b981', color: 'white', border: 'none' }}>
            <MessageCircle size={18} /> WhatsApp
          </button>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
        </div>
      </div>

      {/* Content Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '350px 1fr', overflow: 'hidden' }}>
        
        {/* Sidebar Info */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 1rem', color: '#0f172a' }}>
              {entity.avatar}
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>{entity.detail || 'General'}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '6px' }}>Contacto</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}><Mail size={14} color="var(--accent-cyan)" /> {entity.email || '-'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', marginTop: '6px' }}><Phone size={14} color="var(--accent-cyan)" /> {entity.phone || '-'}</div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '6px' }}>Registro Inicial</label>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{entity.created_at?.split('T')[0]}</p>
            </div>

            {entity.notes && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '6px' }}>Observaciones Base</label>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {entity.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div style={{ padding: '1.5rem 2rem 0', display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button 
              onClick={() => setActiveTab('notes')}
              style={{ paddingBottom: '1rem', background: 'none', border: 'none', color: activeTab === 'notes' ? 'var(--accent-cyan)' : 'white', cursor: 'pointer', borderBottom: activeTab === 'notes' ? '2px solid var(--accent-cyan)' : '2px solid transparent', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FileText size={18} /> {config.labels.historyLabel}
            </button>
            <button 
              onClick={() => setActiveTab('appointments')}
              style={{ paddingBottom: '1rem', background: 'none', border: 'none', color: activeTab === 'appointments' ? 'var(--accent-cyan)' : 'white', cursor: 'pointer', borderBottom: activeTab === 'appointments' ? '2px solid var(--accent-cyan)' : '2px solid transparent', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Calendar size={18} /> Historial de Citas
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
            
            {activeTab === 'notes' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                {/* Add New Note */}
                <form onSubmit={handleSaveNote} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '15px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600 }}>Nueva {config.labels.historyLabel}</label>
                  <textarea 
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder={config.labels.historyPlaceholder}
                    style={{ width: '100%', minHeight: '120px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'white', padding: '1rem', fontFamily: 'inherit', resize: 'none', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" disabled={saving || !newNote.trim()} className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                      {saving ? <Loader className="spin" size={18} /> : <><Send size={18} /> Guardar Nota</>}
                    </button>
                  </div>
                </form>

                {/* History List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                    <History size={20} color="var(--accent-purple)" /> Línea de Tiempo de {config.labels.historyTitle}
                  </h3>
                  
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}><Loader className="spin" /></div>
                  ) : notes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <p style={{ color: 'rgba(255,255,255,0.3)' }}>No hay notas registradas aún.</p>
                    </div>
                  ) : (
                    notes.map((note, idx) => (
                      <div key={note.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                        {idx !== notes.length - 1 && <div style={{ position: 'absolute', left: '19px', top: '40px', bottom: '-20px', width: '2px', background: 'rgba(255,255,255,0.1)' }} />}
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99,102,241,0.2)', border: '2px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                          <FileText size={18} color="#818cf8" />
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{new Date(note.created_at).toLocaleString()}</span>
                            <button onClick={() => handleDeleteNote(note.id)} style={{ background: 'transparent', border: 'none', color: 'rgba(239,68,68,0.4)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {appointments.length === 0 ? (
                      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem' }}>No se encontraron citas confirmadas pasadas.</p>
                    ) : (
                      appointments.map(appt => (
                        <div key={appt.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '10px', borderRadius: '10px' }}>
                              <Calendar size={20} color="#10b981" />
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600 }}>{appt.detail}</p>
                              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{appt.time} (Day {appt.day + 1})</p>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.8rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '20px', fontWeight: 600 }}>
                            Completada
                          </span>
                        </div>
                      ))
                    )}
                 </div>
              </div>
            )}

          </div>
        </div>

      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}

export default PatientDetailView;
