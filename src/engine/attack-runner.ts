import { Attacker, AttackResult } from '../attacks/types';
import { logger } from '../utils/logger';

/**
 * Runs a single attack and handles errors
 */
export async function runAttack(attacker: Attacker): Promise<AttackResult | null> {
  try {
    const result = await attacker.execute();
    return result;
  } catch (error) {
    logger.error(`Attack ${attacker.name} failed:`, error);
    return null;
  }
}

/**
 * Runs multiple attacks in parallel
 */
export async function runParallelAttacks(
  attackers: Attacker[],
  count: number
): Promise<AttackResult[]> {
  const promises: Promise<AttackResult | null>[] = [];
  
  for (let i = 0; i < count; i++) {
    const attacker = attackers[Math.floor(Math.random() * attackers.length)];
    promises.push(runAttack(attacker));
  }
  
  const results = await Promise.all(promises);
  return results.filter((r): r is AttackResult => r !== null);
}
