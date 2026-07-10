import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TelemetryStats } from './TelemetryStats';

describe('TelemetryStats', () => {
  it('should render all 4 capacity cards with correct default status labels', () => {
    render(<TelemetryStats occupancyPercent={84} theme="dark" />);

    expect(screen.getByText('Match Status')).toBeInTheDocument();
    expect(screen.getByText('2nd Half // 72\'')).toBeInTheDocument();

    expect(screen.getByText('Volunteers Active')).toBeInTheDocument();
    expect(screen.getByText('142 / 150')).toBeInTheDocument();

    expect(screen.getByText('Gate Readiness')).toBeInTheDocument();
    expect(screen.getByText('100% OPERATIONAL')).toBeInTheDocument();

    expect(screen.getByText('Stadium Capacity Fill')).toBeInTheDocument();
    expect(screen.getByText('84%')).toBeInTheDocument();
  });

  it('should apply appropriate background theme class in light mode', () => {
    const { container } = render(<TelemetryStats occupancyPercent={60} theme="light" />);
    const cardElement = container.querySelector('.bg-white');
    expect(cardElement).toBeInTheDocument();
  });
});
