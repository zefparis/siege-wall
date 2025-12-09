/**
 * HCS-U7 Security Audit Types
 * Types for real security testing against the HCS-U7 backend
 */

export interface TimingResult {
  vulnerable: boolean;
  prefixResults: { prefix: string; avgTime: number; samples: number }[];
  mean: number;
  stdDev: number;
  anomalies: { prefix: string; avgTime: number; deviation: number }[];
  conclusion: string;
  rawData: number[];
}

export interface ReplayResult {
  firstVerify: boolean;
  secondVerify: boolean;
  parallelSuccesses: number;
  parallelAttempts: number;
  timeBetweenAttempts: number;
  vulnerable: boolean;
  conclusion: string;
}

export interface TimeWindowResult {
  originalTW: number;
  results: { offset: number; valid: boolean; reason?: string }[];
  toleranceWindow: number[];
  vulnerable: boolean;
  conclusion: string;
}

export interface ForgeryResult {
  validCodesCollected: number;
  qsigPatterns: string[];
  b3Patterns: string[];
  forgedAttempts: number;
  forgedSuccesses: number;
  vulnerable: boolean;
  conclusion: string;
}

export interface BruteForceResult {
  durationMs: number;
  attempts: number;
  successes: number;
  successRate: string;
  attacksPerSecond: number;
  avgResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  theoreticalYearsToBreak: string;
  vulnerable: boolean;
  conclusion: string;
}

export interface RateLimitResult {
  burstTest: {
    attempts: number;
    blocked: number;
    successRate: number;
  };
  headerBypassTest: {
    attempts: number;
    blocked: number;
    bypassSuccessful: boolean;
  };
  slowlorisTest: {
    attempts: number;
    blocked: number;
  };
  vulnerable: boolean;
  conclusion: string;
}

export interface EntropyResult {
  samples: number;
  uniqueCEs: number;
  entropyRatio: number;
  timeCorrelation: boolean;
  predictable: boolean;
  vulnerable: boolean;
  conclusion: string;
  cePatterns: { ce: string; count: number }[];
}

export type TestStatus = 'pass' | 'fail' | 'warn' | 'skip' | 'error';

export interface TestResultSummary {
  name: string;
  status: TestStatus;
  details: string;
  duration: number;
}

export interface SecurityTestReport {
  timestamp: Date;
  backend: string;
  version: string;
  tests: {
    timing?: TimingResult;
    replay?: ReplayResult;
    timeWindow?: TimeWindowResult;
    forgery?: ForgeryResult;
    bruteForce?: BruteForceResult;
    rateLimit?: RateLimitResult;
    entropy?: EntropyResult;
  };
  summary: TestResultSummary[];
  overallScore: number;
  vulnerabilities: string[];
  warnings: string[];
  recommendations: string[];
}

export interface SignResponse {
  success: boolean;
  data?: {
    hcsCode: string;
    expiresAt?: string;
  };
  error?: string;
}

export interface VerifyResult {
  valid: boolean;
  score?: number;
  reason?: string;
  statusCode?: number;
  error?: string;
  responseTimeMs: number;
  qsigValid?: boolean;
  b3Valid?: boolean;
}
