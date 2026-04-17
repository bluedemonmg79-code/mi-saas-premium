# 🚀 Antigravity - SaaS B2B Multi-Tenant

Sistema de gestión B2B para múltiples nichos (salud, fitness, educación, etc.) con sistema de reservas públicas, dashboard analytics y multi-idioma.

## 📋 Características

- ✅ **Autenticación segura** con Supabase Auth
- ✅ **Dashboard Analytics** con gráficos en tiempo real
- ✅ **Sistema de reservas públicas** con validación de conflictos
- ✅ **Multi-tenant** con roles (owner/member)
- ✅ **Internacionalización** (Español/Inglés)
- ✅ **Planes de suscripción** (Free/Basic/Pro)
- ✅ **Notificaciones en tiempo real**
- ✅ **Integración con WhatsApp**
- ✅ **Error Boundary** para manejo robusto de errores

## 🛠️ Tecnologías

- **Frontend**: React 19 + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Estilos**: CSSCustomProperties + Glass-morphism
- **Testing**: Jest + React Testing Library
- **i18n**: react-i18next

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/bluedemonmg79-code/mi-saas-premium.git
cd antigravity
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` y agregar tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🧪 Testing

Ejecutar tests:
```bash
npm test
```

Ver cobertura:
```bash
npm test -- --coverage
```

## 🏗️ Estructura del Proyecto

```
antigravity/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── context/         # Contextos de React (Auth, Toast)
│   ├── hooks/           # Custom hooks
│   ├── layouts/         # Layouts principales
│   ├── pages/           # Páginas/vistas
│   ├── lib/             # Configuraciones (Supabase)
│   ├── locales/         # Traducciones (i18n)
│   └── config/          # Configuración de nichos
├── supabase/            # Migraciones y funciones
└── public/              # Assets estáticos
```

## 🔐 Variables de Entorno Requeridas

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase | ✅ |

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

Asegúrate de configurar las variables de entorno en el dashboard de Vercel.

## 📝 Flujos Principales

### 1. Reserva Pública
- Usuario accede a `/u/:username`
- Selecciona fecha y hora disponible
- Llena formulario de contacto
- Sistema valida conflictos en tiempo real
- Notificación al propietario

### 2. Dashboard del Propietario
- Ver estadísticas (ingresos, citas, clientes)
- Gestionar entidades (pacientes/clientes)
- Calendario interactivo
- Confirmar/cancelar citas
- Enviar mensajes por WhatsApp

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor crea un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado. Todos los derechos reservados.

## 🔗 Enlaces

- [Documentación de Supabase](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
