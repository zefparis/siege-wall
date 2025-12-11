import axios, { AxiosInstance } from 'axios';
import { CONFIG } from '../config';

export interface VerifyRequest {
  code: string;
  userId?: string;
  sessionId?: string;
}

export interface VerifyResponse {
  valid: boolean;
  score?: number;
  qsigValid?: boolean;
  b3Valid?: boolean;
  expired?: boolean;
  reason?: string;
  processingTimeMs: number;
}

export class HCSClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: CONFIG.hcs.backendUrl,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async verifyCode(request: VerifyRequest): Promise<VerifyResponse> {
    const start = Date.now();
    
    try {
      const response = await this.client.post('/v1/verify', request);
      
      return {
        ...response.data,
        processingTimeMs: Date.now() - start,
      };
    } catch (error: any) {
      return {
        valid: false,
        reason: error.response?.data?.error || error.message,
        processingTimeMs: Date.now() - start,
      };
    }
  }

  async quickAuth(code: string): Promise<VerifyResponse> {
    const start = Date.now();
    
    try {
      const response = await this.client.post('/api/quick-auth', { code });
      
      return {
        valid: response.data.authenticated,
        score: response.data.score,
        processingTimeMs: Date.now() - start,
      };
    } catch (error: any) {
      return {
        valid: false,
        reason: error.response?.data?.error || error.message,
        processingTimeMs: Date.now() - start,
      };
    }
  }

  async health(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.data.status === 'ok';
    } catch {
      return false;
    }
  }
}
