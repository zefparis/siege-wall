import { SiegeOrchestrator } from './engine/orchestrator';
import { startDashboard } from './dashboard/server';
import { logger } from './utils/logger';
import { formatStatsForDisplay, getAttackTypeBreakdown } from './dashboard/stats';

async function main() {
  logger.info('═══════════════════════════════════════════');
  logger.info('   🏰 HCS-U7 SIEGE WALL - Starting...      ');
  logger.info('═══════════════════════════════════════════');

  const orchestrator = new SiegeOrchestrator();
  
  // Démarrer le dashboard
  startDashboard(orchestrator);
  
  // Démarrer les attaques
  try {
    await orchestrator.start();
  } catch (error) {
    logger.error('Impossible de démarrer le Siege Wall:', error);
    process.exit(1);
  }

  // Afficher stats toutes les 30 secondes
  setInterval(() => {
    const stats = orchestrator.getStats();
    logger.info('───────────────────────────────────────');
    logger.info(`📊 Statistiques Siege Wall`);
    logger.info(`   Total: ${stats.totalAttacks.toLocaleString()} attaques`);
    logger.info(`   Succès: ${stats.successfulAttacks} (${orchestrator.getSuccessRate().toFixed(6)}%)`);
    logger.info(`   Temps moyen: ${Math.round(stats.avgResponseTime)}ms`);
    logger.info('───────────────────────────────────────');
  }, 30000);

  // Graceful shutdown
  process.on('SIGINT', () => {
    logger.info('Arrêt en cours...');
    orchestrator.stop();
    
    const stats = orchestrator.getStats();
    logger.info('═══════════════════════════════════════════');
    logger.info('   📊 RAPPORT FINAL');
    logger.info(formatStatsForDisplay(stats));
    logger.info(getAttackTypeBreakdown(stats));
    logger.info('═══════════════════════════════════════════');
    
    process.exit(0);
  });
}

main();
