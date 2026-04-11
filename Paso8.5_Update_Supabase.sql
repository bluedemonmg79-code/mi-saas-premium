-- =============================================
-- PASO 4: Perfiles VIP y Webhook Subscriptions
-- =============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  plan_type TEXT DEFAULT 'basic',
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS en perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de perfiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- NOTA: Supabase tiene una función "auth.users" que no podemos editar directamente con un trigger fácilmente sin permisos de superuser.
-- Para automatizar, insertamos al perfil cuando se modifica el perfil desde el código, o lo mejor, usar la API de JS al loguearse para crear el row de perfil si no existe.

-- =============================================
-- PASO 5: Storage (Subida de Imágenes)
-- =============================================
-- Creamos un bucket llamado "branding" y le damos reglas
-- (Este paso requiere ser superusuario en Supabase, así que es mejor que lo hagas tú desde el Panel)

-- Instrucciones:
-- 1. Ve a "Storage" en la barra lateral izquierda de Supabase.
-- 2. Clic en "New Bucket".
-- 3. Nómbralo: "branding".
-- 4. Activa la opción "Public bucket" (importante para que las imágenes se vean en el navegador).
-- 5. Ve a "Policies" bajo tu nuevo bucket y dale a "New Custom Policy".
--    - Nombre: "Permitir visualizar a todos" (Select).
--    - Allowed operation: "SELECT".
--    - Target roles: "anon", "authenticated".
-- 6. Dale a "New Custom Policy".
--    - Nombre: "Permitir subir a autenticados" (Insert).
--    - Allowed operation: "INSERT".
--    - Target roles: "authenticated".
