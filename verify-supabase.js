import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 Verificando conexión con Supabase...\n');

// Verificar que las credenciales están configuradas
if (!SUPABASE_URL || SUPABASE_URL === 'your_supabase_project_url_here') {
  console.log('❌ ERROR: VITE_SUPABASE_URL no está configurado en .env');
  console.log('   Por favor, edita el archivo .env con tu URL real de Supabase\n');
  process.exit(1);
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'your_supabase_anon_key_here') {
  console.log('❌ ERROR: VITE_SUPABASE_ANON_KEY no está configurado en .env');
  console.log('   Por favor, edita el archivo .env con tu ANON KEY real de Supabase\n');
  process.exit(1);
}

// Verificar formato de URL
if (!SUPABASE_URL.startsWith('https://') || !SUPABASE_URL.includes('.supabase.co')) {
  console.log('❌ ERROR: VITE_SUPABASE_URL tiene formato inválido');
  console.log('   Debe ser algo como: https://abc123.supabase.co\n');
  process.exit(1);
}

// Verificar formato de ANON KEY
if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
  console.log('❌ ERROR: VITE_SUPABASE_ANON_KEY tiene formato inválido');
  console.log('   La key debe comenzar con "eyJ"\n');
  process.exit(1);
}

console.log('✅ Formato de credenciales: CORRECTO');
console.log(`   URL: ${SUPABASE_URL.substring(0, 30)}...`);
console.log(`   Key: ${SUPABASE_ANON_KEY.substring(0, 20)}...\n`);

// Intentar conectar
try {
  console.log('🔄 Probando conexión...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Hacer una consulta simple para verificar conectividad
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error) {
    if (error.message.includes('relation') || error.message.includes('does not exist')) {
      console.log('⚠️  ADVERTENCIA: Conexión exitosa pero faltan tablas en la base de datos');
      console.log('   Necesitas ejecutar las migraciones SQL');
      console.log('   Ve a tu dashboard de Supabase → SQL Editor\n');
      console.log('✅ Credenciales: VÁLIDAS');
      console.log('❌ Base de datos: FALTA CONFIGURAR\n');
    } else {
      console.log('❌ ERROR de conexión:', error.message);
      console.log('   Verifica que las credenciales sean correctas\n');
      process.exit(1);
    }
  } else {
    console.log('\n🎉 ¡TODO PERFECTO!');
    console.log('✅ Conexión a Supabase: EXITOSA');
    console.log('✅ Base de datos: CONFIGURADA');
    console.log('✅ Tu SaaS está listo para funcionar\n');
  }
  
} catch (err) {
  console.log('❌ ERROR inesperado:', err.message);
  console.log('   Contacta con soporte si el problema persiste\n');
  process.exit(1);
}
