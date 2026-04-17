import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

// Mock de Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn()
    }
  }
}));

// Componente de prueba que usa el contexto
function TestComponent() {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
      <p data-testid="user-email">{user?.email || 'No user'}</p>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar estado de carga inicialmente', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    });
  });

  test('debe establecer usuario cuando hay sesión activa', async () => {
    const mockSession = {
      user: { email: 'test@example.com', id: '123' }
    };

    supabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });

  test('debe manejar sesión nula correctamente', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(screen.getByTestId('user-email')).toHaveTextContent('No user');
    });
  });
});
