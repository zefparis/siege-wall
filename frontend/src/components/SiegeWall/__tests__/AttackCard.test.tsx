/**
 * Tests for AttackCard Component
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AttackCard } from '../AttackCard';
import { AttackVector } from '../../../lib/siege-wall-attacks';

const mockAttack: AttackVector = {
  id: 'test-123',
  type: 'brute-force',
  status: 'REJECTED',
  timestamp: Date.now(),
  confidence: 0.15,
  method: 'Random Code Generation',
  details: 'Invalid signature detected',
  responseTime: 45,
  payload: 'HCS-U7|V:8.0|...',
};

describe('AttackCard', () => {
  it('renders attack type name', () => {
    render(<AttackCard attack={mockAttack} index={0} />);
    expect(screen.getByText('Brute Force')).toBeInTheDocument();
  });

  it('renders attack status', () => {
    render(<AttackCard attack={mockAttack} index={0} />);
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
  });

  it('renders attack method', () => {
    render(<AttackCard attack={mockAttack} index={0} />);
    expect(screen.getByText('Random Code Generation')).toBeInTheDocument();
  });

  it('renders attack details', () => {
    render(<AttackCard attack={mockAttack} index={0} />);
    expect(screen.getByText('Invalid signature detected')).toBeInTheDocument();
  });

  it('renders response time', () => {
    render(<AttackCard attack={mockAttack} index={0} />);
    expect(screen.getByText('45ms')).toBeInTheDocument();
  });

  it('renders confidence percentage', () => {
    render(<AttackCard attack={mockAttack} index={0} />);
    expect(screen.getByText('Conf: 15%')).toBeInTheDocument();
  });

  it('applies breach styling when status is BREACH', () => {
    const breachAttack = { ...mockAttack, status: 'BREACH' as const };
    const { container } = render(<AttackCard attack={breachAttack} index={0} />);
    
    const card = container.firstChild;
    expect(card).toHaveClass('bg-red-950/80');
  });

  it('applies normal styling when status is REJECTED', () => {
    const { container } = render(<AttackCard attack={mockAttack} index={0} />);
    
    const card = container.firstChild;
    expect(card).toHaveClass('bg-slate-900/80');
  });

  it('shows warning icon for breach attacks', () => {
    const breachAttack = { ...mockAttack, status: 'BREACH' as const };
    const { container } = render(<AttackCard attack={breachAttack} index={0} />);
    
    // Check for the warning overlay
    const overlay = container.querySelector('.bg-red-500\\/20');
    expect(overlay).toBeInTheDocument();
  });
});
