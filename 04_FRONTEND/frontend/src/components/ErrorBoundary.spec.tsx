import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const BrokenComponent = () => {
  throw new Error('Component crashed!');
};

describe('ErrorBoundary', () => {
  const consoleErrorMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('console', { ...console, error: consoleErrorMock });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Child Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal Child Content')).toBeInTheDocument();
  });

  it('should render default fallback UI when a child crashes', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('System Component Error')).toBeInTheDocument();
    expect(screen.getByText('Component crashed!')).toBeInTheDocument();
  });

  it('should render custom fallback component if provided on error', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error Screen</div>}>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error Screen')).toBeInTheDocument();
    expect(screen.queryByText('System Component Error')).not.toBeInTheDocument();
  });

  it('should allow retrying and resetting state after crash', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('System Component Error')).toBeInTheDocument();

    // Rerender with normal component to simulate resetting state
    rerender(
      <ErrorBoundary>
        <div>Recovered Child Content</div>
      </ErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /retry component/i });
    fireEvent.click(retryButton);

    expect(screen.getByText('Recovered Child Content')).toBeInTheDocument();
    expect(screen.queryByText('System Component Error')).not.toBeInTheDocument();
  });
});
