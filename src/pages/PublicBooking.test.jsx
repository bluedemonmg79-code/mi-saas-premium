import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PublicBooking from './PublicBooking';
import { supabase } from '../lib/supabase';

// Mock de Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          eq: jest.fn()
        })),
        single: jest.fn()
      })),
      insert: jest.fn()
    }))
  }
}));

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ username: 'testuser' })
}));

// Mock de i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key
  })
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PublicBooking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe mostrar loader mientras carga', () => {
    const mockSelect = jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => new Promise(() => {})) // Promise que nunca resuelve
        }))
      }))
    }));

    supabase.from.mockReturnValue({
      select: mockSelect
    });

    renderWithRouter(<PublicBooking />);
    
    // Debe mostrar el loader
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
  });

  test('debe mostrar error cuando el profesional no existe', async () => {
    const mockSelect = jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: new Error('Not found') }))
        }))
      }))
    }));

    supabase.from.mockReturnValue({
      select: mockSelect
    });

    renderWithRouter(<PublicBooking />);

    await waitFor(() => {
      expect(screen.getByText(/booking.error_not_available/i)).toBeInTheDocument();
    });
  });

  test('debe renderizar formulario de reserva cuando encuentra profesional', async () => {
    const mockProfessional = {
      id: '123',
      username: 'testuser',
      business_name: 'Test Business',
      niche: 'health',
      public_booking_enabled: true,
      slot_duration: 60
    };

    const mockSelect = jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockProfessional, error: null }))
        }))
      }))
    }));

    supabase.from.mockReturnValue({
      select: mockSelect
    });

    renderWithRouter(<PublicBooking />);

    await waitFor(() => {
      expect(screen.getByText('Test Business')).toBeInTheDocument();
    });
  });

  test('debe permitir seleccionar fecha', async () => {
    const mockProfessional = {
      id: '123',
      username: 'testuser',
      business_name: 'Test Business',
      niche: 'health',
      public_booking_enabled: true,
      slot_duration: 60
    };

    const mockSelect = jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: mockProfessional, error: null }))
        }))
      }))
    }));

    supabase.from.mockReturnValue({
      select: mockSelect
    });

    renderWithRouter(<PublicBooking />);

    await waitFor(() => {
      expect(screen.getByText('Test Business')).toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/booking.label_date/i);
    fireEvent.change(dateInput, { target: { value: '2026-05-01' } });

    expect(dateInput.value).toBe('2026-05-01');
  });
});
