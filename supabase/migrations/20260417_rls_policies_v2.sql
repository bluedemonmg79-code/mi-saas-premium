-- =====================================================
-- Row Level Security (RLS) Policies para Antigravity
-- VERSION 2: Elimina políticas existentes antes de crearlas
-- =====================================================

-- ================== PROFILES ==================
-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- ================== ENTITIES ==================
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Owners can view own entities" ON entities;
DROP POLICY IF EXISTS "Owners can insert entities" ON entities;
DROP POLICY IF EXISTS "Owners can update own entities" ON entities;
DROP POLICY IF EXISTS "Only owners can delete entities" ON entities;

-- Habilitar RLS
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;

-- Crear políticas
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

CREATE POLICY "Owners can insert entities" 
ON entities FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can update own entities" 
ON entities FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Only owners can delete entities" 
ON entities FOR DELETE 
USING (user_id = auth.uid());

-- ================== APPOINTMENTS ==================
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "View own appointments" ON appointments;
DROP POLICY IF EXISTS "Insert appointments" ON appointments;
DROP POLICY IF EXISTS "Update own appointments" ON appointments;
DROP POLICY IF EXISTS "Delete own appointments" ON appointments;

-- Habilitar RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Crear políticas
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

CREATE POLICY "Insert appointments" 
ON appointments FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR user_id IN (SELECT id FROM profiles WHERE public_booking_enabled = true)
);

CREATE POLICY "Update own appointments" 
ON appointments FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Delete own appointments" 
ON appointments FOR DELETE 
USING (user_id = auth.uid());

-- ================== TEAM_MEMBERS ==================
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "View own team members" ON team_members;
DROP POLICY IF EXISTS "Owners can invite team members" ON team_members;
DROP POLICY IF EXISTS "Owners can remove team members" ON team_members;

-- Habilitar RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "View own team members" 
ON team_members FOR SELECT 
USING (
  owner_id = auth.uid() 
  OR member_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Owners can invite team members" 
ON team_members FOR INSERT 
WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can remove team members" 
ON team_members FOR DELETE 
USING (owner_id = auth.uid());

-- ================== NOTIFICATIONS ==================
-- Eliminar políticas existentes
DROP POLICY IF EXISTS "View own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Update own notifications" ON notifications;
DROP POLICY IF EXISTS "Delete own notifications" ON notifications;

-- Habilitar RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "View own notifications" 
ON notifications FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" 
ON notifications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Update own notifications" 
ON notifications FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Delete own notifications" 
ON notifications FOR DELETE 
USING (user_id = auth.uid());

-- ================== MEDICAL_NOTES ==================
-- Eliminar y recrear políticas para medical_notes (si existe)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'medical_notes') THEN
    -- Eliminar políticas existentes
    DROP POLICY IF EXISTS "View own medical notes" ON medical_notes;
    DROP POLICY IF EXISTS "Insert own medical notes" ON medical_notes;
    DROP POLICY IF EXISTS "Delete own medical notes" ON medical_notes;
    
    -- Habilitar RLS
    ALTER TABLE medical_notes ENABLE ROW LEVEL SECURITY;
    
    -- Crear políticas
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

-- Índices en appointments
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

-- Función para limpiar notificaciones antiguas
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
