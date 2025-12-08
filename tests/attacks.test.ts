import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BruteForceAttacker } from '../src/attacks/brute-force';
import { ReplayAttacker } from '../src/attacks/replay';
import { ExpiredCodeAttacker } from '../src/attacks/expired-code';
import { MalformedAttacker } from '../src/attacks/malformed';
import { TimingAttacker } from '../src/attacks/timing';
import { GradientAttacker } from '../src/attacks/gradient';
import { AISimulationAttacker } from '../src/attacks/ai-simulation';
import { HCSClient } from '../src/api/hcs-client';

// Mock HCSClient
const mockClient = {
  verifyCode: vi.fn().mockResolvedValue({
    valid: false,
    score: 0,
    processingTimeMs: 50,
    reason: 'Invalid signature',
  }),
  quickAuth: vi.fn().mockResolvedValue({
    valid: false,
    processingTimeMs: 50,
  }),
  health: vi.fn().mockResolvedValue(true),
} as unknown as HCSClient;

describe('Attack Modules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BruteForceAttacker', () => {
    it('should generate random HCS codes', async () => {
      const attacker = new BruteForceAttacker(mockClient);
      const result = await attacker.execute();
      
      expect(result.attackType).toBe('brute-force');
      expect(result.payload).toMatch(/^HCS-U7\|/);
      expect(result.success).toBe(false);
      expect(mockClient.verifyCode).toHaveBeenCalled();
    });

    it('should include all required segments', async () => {
      const attacker = new BruteForceAttacker(mockClient);
      const result = await attacker.execute();
      
      expect(result.payload).toContain('V:7.0');
      expect(result.payload).toContain('ALG:QS');
      expect(result.payload).toContain('QSIG:');
      expect(result.payload).toContain('B3:');
    });
  });

  describe('ReplayAttacker', () => {
    it('should use captured codes when available', async () => {
      const attacker = new ReplayAttacker(mockClient);
      const capturedCode = 'HCS-U7|V:7.0|ALG:QS|CAPTURED';
      
      attacker.captureCode(capturedCode);
      const result = await attacker.execute();
      
      expect(result.attackType).toBe('replay');
      expect(result.payload).toBe(capturedCode);
    });

    it('should generate fake old code when no captures', async () => {
      const attacker = new ReplayAttacker(mockClient);
      const result = await attacker.execute();
      
      expect(result.payload).toContain('TW:');
      expect(result.metadata?.codeAge).toBeGreaterThan(0);
    });
  });

  describe('ExpiredCodeAttacker', () => {
    it('should generate codes with expired time windows', async () => {
      const attacker = new ExpiredCodeAttacker(mockClient);
      const result = await attacker.execute();
      
      expect(result.attackType).toBe('expired-code');
      expect(result.metadata?.windowOffset).toBeGreaterThanOrEqual(2);
      expect(result.metadata?.windowOffset).toBeLessThanOrEqual(10);
    });
  });

  describe('MalformedAttacker', () => {
    it('should generate various malformed codes', async () => {
      const attacker = new MalformedAttacker(mockClient);
      
      // Run multiple times to test different malformations
      for (let i = 0; i < 10; i++) {
        const result = await attacker.execute();
        expect(result.attackType).toBe('malformed');
        expect(result.metadata?.malformationType).toBeDefined();
      }
    });
  });

  describe('TimingAttacker', () => {
    it('should track response time statistics', async () => {
      const attacker = new TimingAttacker(mockClient);
      
      // Run multiple attacks
      for (let i = 0; i < 5; i++) {
        await attacker.execute();
      }
      
      const result = await attacker.execute();
      expect(result.metadata?.measurementCount).toBe(6);
      expect(result.metadata?.avgResponseTime).toBeGreaterThan(0);
    });
  });

  describe('GradientAttacker', () => {
    it('should mutate parameters and track best score', async () => {
      const attacker = new GradientAttacker(mockClient);
      
      const result1 = await attacker.execute();
      expect(result1.metadata?.attempt).toBe(1);
      
      const result2 = await attacker.execute();
      expect(result2.metadata?.attempt).toBe(2);
    });
  });

  describe('AISimulationAttacker', () => {
    it('should cycle through AI patterns', async () => {
      const attacker = new AISimulationAttacker(mockClient);
      
      const patterns = new Set<string>();
      for (let i = 0; i < 7; i++) {
        const result = await attacker.execute();
        patterns.add(result.metadata?.patternName);
      }
      
      // Should have used all 7 patterns
      expect(patterns.size).toBe(7);
    });
  });
});

describe('HCS Code Format', () => {
  it('should validate QSIG length (64 hex chars)', () => {
    const validQsig = 'a'.repeat(64);
    expect(validQsig.length).toBe(64);
    expect(/^[a-f0-9]{64}$/.test(validQsig)).toBe(true);
  });

  it('should validate B3 length (64 hex chars)', () => {
    const validB3 = 'b'.repeat(64);
    expect(validB3.length).toBe(64);
    expect(/^[a-f0-9]{64}$/.test(validB3)).toBe(true);
  });

  it('should validate time window format', () => {
    const currentTw = Math.floor(Date.now() / 1000 / 30);
    expect(currentTw).toBeGreaterThan(0);
    expect(Number.isInteger(currentTw)).toBe(true);
  });
});
