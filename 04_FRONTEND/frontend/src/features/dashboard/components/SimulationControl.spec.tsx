import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SimulationControl } from './SimulationControl';

describe('SimulationControl', () => {
  it('should render the Operations simulation buttons', () => {
    const mockSetSimMode = vi.fn();
    render(<SimulationControl simMode="NORMAL" setSimMode={mockSetSimMode} theme="dark" />);

    expect(screen.getByText('NORMAL')).toBeInTheDocument();
    expect(screen.getByText('HALFTIME')).toBeInTheDocument();
    expect(screen.getByText('EXIT')).toBeInTheDocument();
    expect(screen.getByText('EMERGENCY')).toBeInTheDocument();
  });

  it('should trigger callback with selected mode when clicked', () => {
    const mockSetSimMode = vi.fn();
    render(<SimulationControl simMode="NORMAL" setSimMode={mockSetSimMode} theme="dark" />);

    const exitButton = screen.getByRole('button', { name: /EXIT/i });
    fireEvent.click(exitButton);

    expect(mockSetSimMode).toHaveBeenCalledWith('EXIT');
  });

  it('should render emergency button with distinct styling on EMERGENCY active', () => {
    const mockSetSimMode = vi.fn();
    render(<SimulationControl simMode="EMERGENCY" setSimMode={mockSetSimMode} theme="dark" />);

    const emergencyButton = screen.getByRole('button', { name: /EMERGENCY/i });
    expect(emergencyButton).toHaveClass('bg-[#FF1744]');
  });
});
