import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

// Lazy loading: cada página se carga solo cuando el usuario la visita
const Dashboard   = lazy(() => import('./pages/Dashboard'));
const EntityList  = lazy(() => import('./pages/EntityList'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const SettingsView = lazy(() => import('./pages/SettingsView'));
const Login       = lazy(() => import('./pages/Login'));
const Pricing     = lazy(() => import('./pages/Pricing'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'));

const PageLoader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'rgba(255,255,255,0.4)', gap: '12px' }}>
    <div style={{ width: 20, height: 20, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    Cargando...
    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
  </div>
);

function App() {
  const [currentNiche, setCurrentNiche] = useState('health');

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            
            {/* Rutas Protegidas por Login */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout currentNiche={currentNiche} setCurrentNiche={setCurrentNiche} />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="entities" element={<EntityList />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="settings" element={<SettingsView />} />
            </Route>
            
            {/* Fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;