import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom Hook para gestionar citas/appointments
 * Extrae la lógica de negocio de los componentes
 */
export function useAppointments(userId, niche, options = {}) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    limit = null,
    status = null,
    orderBy = 'time',
    ascending = true,
    realtime = false
  } = options;

  useEffect(() => {
    if (!userId || !niche) {
      setLoading(false);
      return;
    }

    fetchAppointments();

    // Suscripción realtime opcional
    if (realtime) {
      const channel = supabase
        .channel('appointments-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'appointments',
            filter: `user_id=eq.${userId}`
          },
          () => {
            fetchAppointments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, niche, limit, status, orderBy, ascending, realtime]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .eq('niche', niche)
        .order(orderBy, { ascending });

      if (status) {
        query = query.eq('status', status);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      // Actualizar estado local
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: 'confirmed' } : apt
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error confirming appointment:', err);
      return { success: false, error: err.message };
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { error: deleteError } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (deleteError) throw deleteError;

      // Actualizar estado local
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));

      return { success: true };
    } catch (err) {
      console.error('Error canceling appointment:', err);
      return { success: false, error: err.message };
    }
  };

  const updateAppointment = async (appointmentId, updates) => {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      // Actualizar estado local
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, ...updates } : apt
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating appointment:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    appointments,
    loading,
    error,
    refresh: fetchAppointments,
    confirmAppointment,
    cancelAppointment,
    updateAppointment
  };
}
