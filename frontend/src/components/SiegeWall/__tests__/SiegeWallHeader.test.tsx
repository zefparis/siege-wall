/**
 * Tests for SiegeWallHeader Component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SiegeWallHeader } from '../SiegeWallHeader';

describe('SiegeWallHeader', () => {
  const defaultProps = {
    isConnected: true,
    isLive: false,
    onToggleSiege: vi.fn(),
  };

  it('renders the title', () => {
    render(<SiegeWallHeader {...defaultProps} />);
    expect(screen.getByText('HCS-U7 SIEGE WALL')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<SiegeWallHeader {...defaultProps} />);
    expect(screen.getByText('LIVE SECURITY CHALLENGE • REAL ATTACKS')).toBeInTheDocument();
  });

  it('shows CONNECTED status when connected', () => {
    render(<SiegeWallHeader {...defaultProps} isConnected={true} />);
    expect(screen.getByText('CONNECTED')).toBeInTheDocument();
  });

  it('shows OFFLINE status when disconnected', () => {
    render(<SiegeWallHeader {...defaultProps} isConnected={false} />);
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  });

  it('shows TRY TO HACK button when not live', () => {
    render(<SiegeWallHeader {...defaultProps} isLive={false} />);
    expect(screen.getByText('TRY TO HACK')).toBeInTheDocument();
  });

  it('shows STOP SIEGE button when live', () => {
    render(<SiegeWallHeader {...defaultProps} isLive={true} />);
    expect(screen.getByText('STOP SIEGE')).toBeInTheDocument();
  });

  it('calls onToggleSiege when button is clicked', () => {
    const onToggleSiege = vi.fn();
    render(<SiegeWallHeader {...defaultProps} onToggleSiege={onToggleSiege} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onToggleSiege).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling for connected state', () => {
    render(<SiegeWallHeader {...defaultProps} isConnected={true} />);
    const statusElement = screen.getByText('CONNECTED').parentElement;
    expect(statusElement).toHaveClass('bg-green-500/20');
  });

  it('applies correct styling for disconnected state', () => {
    render(<SiegeWallHeader {...defaultProps} isConnected={false} />);
    const statusElement = screen.getByText('OFFLINE').parentElement;
    expect(statusElement).toHaveClass('bg-red-500/20');
  });
});
