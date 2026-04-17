-- =====================================================
-- Tabla para Rate Limiting
-- =====================================================
-- Esta tabla rastrea intentos de acceso para prevenir abuso

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  action TEXT NOT NULL, -- 'booking_attempt', 'profile_view', etc.
  professional_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  attempts INTEGER DEFAULT 1,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_action ON rate_limits(ip, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_professional ON rate_limits(professional_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_attempt ON rate_limits(last_attempt);

-- Habilitar RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Solo el sistema puede gestionar rate limits
CREATE POLICY "System can manage rate limits" 
ON rate_limits FOR ALL 
USING (true)
WITH CHECK (true);

-- Función para limpiar registros antiguos (más de 24 horas)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE last_attempt < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE rate_limits IS 'Registros de rate limiting para prevenir abuso del sistema';
COMMENT ON COLUMN rate_limits.ip IS 'Dirección IP del cliente';
COMMENT ON COLUMN rate_limits.action IS 'Tipo de acción realizada';
COMMENT ON COLUMN rate_limits.attempts IS 'Número de intentos en la ventana de tiempo';
COMMENT ON COLUMN rate_limits.last_attempt IS 'Timestamp del último intento';
