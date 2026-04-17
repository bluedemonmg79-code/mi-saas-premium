-- =====================================================
-- Row Level Security (RLS) Policies para Antigravity
-- =====================================================
-- Estas políticas aseguran que los usuarios solo puedan
-- acceder a sus propios datos y los de su equipo

-- ================== PROFILES ==================
-- Habilitar RLS en la tabla profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Los usuarios pueden insertar su propio perfil (al registrarse)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ================== ENTITIES ==================
-- Habilitar RLS en la tabla entities
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

-- Los owners pueden ver sus propias entidades
CREATE POLICY "Owners can view own entities" 
ON entities FOR SELECT 
USING (
  user_id = auth.uid() 
  OR user_id IN (
    SELECT owner_id FROM team_members WHERE member_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  )
);

-- Los owners pueden insertar entidades
CREATE POLICY "Owners can insert entities" 
ON entities FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Los owners pueden actualizar sus entidades
CREATE POLICY "Owners can update own entities" 
ON entities FOR UPDATE 
USING (user_id = auth.uid());

-- Solo los owners pueden eliminar entidades (no los miembros del equipo)
CREATE POLICY "Only owners can delete entities" 
ON entities FOR DELETE 
USING (user_id = auth.uid());

-- ================== APPOINTMENTS ==================
-- Habilitar RLS en la tabla appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Ver citas propias y de equipos
CREATE POLICY "View own appointments" 
ON appointments FOR SELECT 
USING (
  user_id = auth.uid() 
  OR user_id IN (
    SELECT owner_id FROM team_members WHERE member_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  )
);

-- Insertar citas (owners y reservas públicas)
CREATE POLICY "Insert appointments" 
ON appointments FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR user_id IN (SELECT id FROM profiles WHERE public_booking_enabled = true)
);

-- Actualizar citas propias
CREATE POLICY "Update own appointments" 
ON appointments FOR UPDATE 
USING (user_id = auth.uid());

-- Eliminar citas propias
CREATE POLICY "Delete own appointments" 
ON appointments FOR DELETE 
USING (user_id = auth.uid());

-- ================== TEAM_MEMBERS ==================
-- Habilitar RLS en la tabla team_members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Ver miembros de tu equipo
CREATE POLICY "View own team members" 
ON team_members FOR SELECT 
USING (
  owner_id = auth.uid() 
  OR member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Solo owners pueden invitar miembros
CREATE POLICY "Owners can invite team members" 
ON team_members FOR INSERT 
WITH CHECK (owner_id = auth.uid());

-- Solo owners pueden remover miembros
CREATE POLICY "Owners can remove team members" 
ON team_members FOR DELETE 
USING (owner_id = auth.uid());

-- ================== NOTIFICATIONS ==================
-- Habilitar RLS en la tabla notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Ver solo notificaciones propias
CREATE POLICY "View own notifications" 
ON notifications FOR SELECT 
USING (user_id = auth.uid());

-- Sistema puede crear notificaciones
CREATE POLICY "System can create notifications" 
ON notifications FOR INSERT 
WITH CHECK (true);

-- Actualizar notificaciones propias (marcar como leídas)
CREATE POLICY "Update own notifications" 
ON notifications FOR UPDATE 
USING (user_id = auth.uid());

-- Eliminar notificaciones propias
CREATE POLICY "Delete own notifications" 
ON notifications FOR DELETE 
USING (user_id = auth.uid());

-- ================== MEDICAL_NOTES ==================
-- Habilitar RLS en la tabla medical_notes (si existe)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'medical_notes') THEN
    ALTER TABLE medical_notes ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "View own medical notes" 
    ON medical_notes FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM entities 
        WHERE entities.id = medical_notes.entity_id 
        AND entities.user_id = auth.uid()
      )
    );
    
    CREATE POLICY "Insert own medical notes" 
    ON medical_notes FOR INSERT 
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM entities 
        WHERE entities.id = medical_notes.entity_id 
        AND entities.user_id = auth.uid()
      )
    );
    
    CREATE POLICY "Delete own medical notes" 
    ON medical_notes FOR DELETE 
    USING (
      EXISTS (
        SELECT 1 FROM entities 
        WHERE entities.id = medical_notes.entity_id 
        AND entities.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- =====================================================
-- ÍNDICES para mejorar rendimiento
-- =====================================================

-- Índices en appointments para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_full_date ON appointments(full_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_user_niche ON appointments(user_id, niche);

-- Índices en entities
CREATE INDEX IF NOT EXISTS idx_entities_user_id ON entities(user_id);
CREATE INDEX IF NOT EXISTS idx_entities_user_niche ON entities(user_id, niche);

-- Índices en profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Índices en notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para limpiar notificaciones antiguas (más de 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days' 
  AND read = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas del usuario
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID, target_niche TEXT)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_entities', (SELECT COUNT(*) FROM entities WHERE user_id = target_user_id AND niche = target_niche),
    'total_appointments', (SELECT COUNT(*) FROM appointments WHERE user_id = target_user_id AND niche = target_niche),
    'confirmed_appointments', (SELECT COUNT(*) FROM appointments WHERE user_id = target_user_id AND niche = target_niche AND status = 'confirmed'),
    'pending_appointments', (SELECT COUNT(*) FROM appointments WHERE user_id = target_user_id AND niche = target_niche AND status = 'pending')
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
