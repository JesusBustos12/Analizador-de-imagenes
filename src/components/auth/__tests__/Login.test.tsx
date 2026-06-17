import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../Login';

describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(<Login onLogin={vi.fn()} onSwitchToRegister={vi.fn()} />);
    
    expect(screen.getByText('Acceso Restringido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('oficial@agencia.gob')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /autenticar/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<Login onLogin={vi.fn()} onSwitchToRegister={vi.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /autenticar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument(); // As the form is empty, Zod error triggers
    });
  });

  it('calls onLogin with correct credentials', async () => {
    const mockOnLogin = vi.fn().mockResolvedValue({ success: true });
    render(<Login onLogin={mockOnLogin} onSwitchToRegister={vi.fn()} />);
    
    const emailInput = screen.getByPlaceholderText('oficial@agencia.gob');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByRole('button', { name: /autenticar/i });

    fireEvent.change(emailInput, { target: { value: 'test@admin.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@admin.com', 'password123');
    });
  });
});
