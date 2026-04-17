import React, { memo } from 'react';
import { Clock, Phone, Mail } from 'lucide-react';

/**
 * Componente optimizado con React.memo para lista de citas
 * Solo re-renderiza cuando las props cambian
 */
const AppointmentItem = memo(({ appointment, onClick }) => {
  return (
    <div 
      className="appointment-item" 
      onClick={() => onClick(appointment)} 
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
    >
      <div className="app-time">
        {appointment.time}
        {appointment.full_date && (
          <span style={{ display: 'block', fontSize: '10px', opacity: 0.5 }}>
            {appointment.full_date.split('-').slice(1).reverse().join('/')}
          </span>
        )}
      </div>
      <div className="app-details">
        <h4>{appointment.name}</h4>
        <p>{appointment.detail || (appointment.origin === 'web' ? 'Agendado vía Web' : '')}</p>
      </div>
      <div 
        className={`app-status ${appointment.status}`} 
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
      </div>
    </div>
  );
});

AppointmentItem.displayName = 'AppointmentItem';

/**
 * Lista de citas optimizada
 */
const AppointmentList = memo(({ appointments, onAppointmentClick, loading }) => {
  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
        <Clock style={{ animation: 'spin 1s infinite' }} />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '2rem 0' }}>
        No hay citas próximas.
      </p>
    );
  }

  return (
    <div className="appointment-list">
      {appointments.map(app => (
        <AppointmentItem 
          key={app.id} 
          appointment={app} 
          onClick={onAppointmentClick}
        />
      ))}
    </div>
  );
});

AppointmentList.displayName = 'AppointmentList';

export default AppointmentList;
