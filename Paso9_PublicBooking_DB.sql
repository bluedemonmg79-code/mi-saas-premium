-- =============================================
-- PASO 9: Habilitar Link Público y Reservas Web
-- =============================================

-- 1. Actualizar la tabla PROFILES con datos públicos y el 'username' del link
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS owner_name TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS public_booking_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS niche TEXT;

-- Para permitir que los clientes de la web accedan al perfil a través de su 'username'
-- Esta política permite que cualquier usuario anónimo vea perfiles que tienen 'public_booking_enabled' en true
DROP POLICY IF EXISTS "Anyone can view public profiles" ON profiles;
CREATE POLICY "Anyone can view public profiles" 
ON profiles 
FOR SELECT 
USING (public_booking_enabled = true);

-- 2. Actualizar la tabla APPOINTMENTS para soportar campos del cliente web
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS origin TEXT DEFAULT 'dashboard',
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Para permitir que un cliente no logueado cree una cita desde la web
DROP POLICY IF EXISTS "Anyone can insert web appointments" ON appointments;
CREATE POLICY "Anyone can insert web appointments" 
ON appointments 
FOR INSERT 
WITH CHECK (origin = 'web');

-- RESULTADO FINAL: 
-- Ve al panel "SQL Editor" en Supabase.
-- Pega este script completo y haz clic en "RUN".
