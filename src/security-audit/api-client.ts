/**
 * HCS-U7 Security Audit API Client
 * Direct HTTP client for security testing with precise timing
 * 
 * FIXED: Uses public endpoints /v1/auth/sign and /v1/verify
 */

import { CONFIG } from '../config';
import { SignResponse, VerifyResult } from './types';

interface ApiResponse {
  valid?: boolean;
  authenticated?: boolean;
  score?: number;
  reason?: string;
  error?: string;
  hcsCode?: string;
  expiresAt?: string;
  status?: string;
  qsigValid?: boolean;
  b3Valid?: boolean;
  data?: {
    hcsCode: string;
    expiresAt?: string;
  };
}

export class SecurityAuditClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = CONFIG.hcs.backendUrl;
  }

  async sign(userId: string, score: number): Promise<SignResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/auth/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, score }),
      });

      if (response.ok) {
        const data = await response.json() as ApiResponse;
        const hcsCode = data.data?.hcsCode || data.hcsCode || '';
        if (hcsCode) {
          return { success: true, data: { hcsCode } };
        }
      }

      const errorText = await response.text().catch(() => '');
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async verify(code: string, headers?: Record<string, string>): Promise<VerifyResult> {
    const start = process.hrtime.bigint();

    try {
      const response = await fetch(`${this.baseUrl}/v1/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ code }),
      });

      const end = process.hrtime.bigint();
      const responseTimeMs = Number(end - start) / 1e6;
      const data = await response.json() as ApiResponse;

      return {
        valid: data.valid === true,
        score: data.score,
        reason: data.reason || data.error,
        statusCode: response.status,
        responseTimeMs,
        qsigValid: data.qsigValid,
        b3Valid: data.b3Valid,
      };
    } catch (error: any) {
      const end = process.hrtime.bigint();
      return {
        valid: false,
        error: error.message,
        statusCode: 0,
        responseTimeMs: Number(end - start) / 1e6,
      };
    }
  }

  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  getBackendUrl(): string {
    return this.baseUrl;
  }
}
