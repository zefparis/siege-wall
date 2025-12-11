/**
 * Tests for SiegeWallStats Component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SiegeWallStats } from '../SiegeWallStats';
import { SiegeStats } from '../../../lib/siege-wall-attacks';

const mockStats: SiegeStats = {
  totalAttacks: 1000,
  breaches: 0,
  successRate: 100.0,
  uptime: 3600,
  attacksPerSecond: 10.5,
  vectors: {
    cognitive: { active: true, blocked: 250 },
    celestial: { synced: true, entropy: 99.8 },
    quantum: { secure: true, hardening: 'Post-Quantum QSIG' },
    behavioral: { monitoring: true, anomalies: 0 },
  },
};

const formatUptime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

describe('SiegeWallStats', () => {
  it('renders total attacks count', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('renders defense rate', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    expect(screen.getByText('100.000000%')).toBeInTheDocument();
  });

  it('renders breaches count', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders formatted uptime', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    expect(screen.getByText('1h 0m 0s')).toBeInTheDocument();
  });

  it('renders attacks per second', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    expect(screen.getByText('10.50')).toBeInTheDocument();
  });

  it('renders all defense vector statuses', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    
    expect(screen.getByText('Cognitive')).toBeInTheDocument();
    expect(screen.getByText('Celestial')).toBeInTheDocument();
    expect(screen.getByText('Quantum')).toBeInTheDocument();
    expect(screen.getByText('Behavioral')).toBeInTheDocument();
  });

  it('shows ACTIVE status for active cognitive vector', () => {
    render(<SiegeWallStats stats={mockStats} formatUptime={formatUptime} />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('shows breach count with red styling when breaches > 0', () => {
    const statsWithBreaches = { ...mockStats, breaches: 5 };
    render(<SiegeWallStats stats={statsWithBreaches} formatUptime={formatUptime} />);
    
    const breachElement = screen.getByText('5');
    expect(breachElement).toHaveClass('text-red-500');
  });
});
