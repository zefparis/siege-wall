import { MainCounter } from '../Core/MainCounter';
import { SuccessRate } from '../Core/SuccessRate';
import { UptimeCounter } from '../Core/UptimeCounter';
import { IntegrityShield } from '../Core/IntegrityShield';
import { AttackStream } from '../Streams/AttackStream';
import { StatsPanel } from '../Stats/StatsPanel';
import { HallOfShame } from '../Stats/HallOfShame';
import { Timeline } from '../Stats/Timeline';
import { MatrixRain } from '../Effects/MatrixRain';
import { AttackGlobe } from '../Effects/AttackGlobe';
import { ConnectionStatus } from '../Core/ConnectionStatus';
import { VerifyButton } from '../Core/VerifyButton';
import { ActiveDefenses } from '../Core/ActiveDefenses';

export function SiegeWall() {
  return (
    <div className="relative w-full min-h-full bg-bg-primary grid-bg overflow-x-hidden overflow-y-auto">
      {/* Background Effects */}
      <div className="hidden lg:block">
        <MatrixRain />
      </div>
      <AttackGlobe />
      
      {/* Main Content */}
      <div className="relative z-10 w-full p-3 md:p-4 flex flex-col gap-4 lg:gap-4">
        
        {/* Header Row */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <h1 className="font-display text-lg md:text-2xl text-cyan tracking-wider">
              HCS-U7 SIEGE WALL
            </h1>
            <ConnectionStatus />
            <VerifyButton />
          </div>
          <div className="text-text-secondary text-xs md:text-sm font-mono hidden md:block">
            COGNITIVE AUTHENTICATION DEFENSE SYSTEM
          </div>
        </header>

        {/* Main Counter - Center Top */}
        <section className="flex flex-col items-center justify-center py-2 md:py-4">
          <MainCounter />
        </section>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left Panel - Stats (Mobile: Full width, Desktop: 3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
            <StatsPanel />
            <HallOfShame />
          </div>

          {/* Center - Shield and Key Metrics (Mobile: Full width, Desktop: 6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center gap-4 md:gap-6 order-1 lg:order-2">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12 w-full">
              <SuccessRate />
              <IntegrityShield />
              <UptimeCounter />
            </div>
            <ActiveDefenses />
          </div>

          {/* Right Panel - Attack Stream (Mobile: Full width, Desktop: 3 cols) */}
          <div className="lg:col-span-3 order-3 min-h-[300px] lg:min-h-0">
            <AttackStream />
          </div>
        </div>

        {/* Bottom - Timeline */}
        <section className="mt-2">
          <Timeline />
        </section>
      </div>
    </div>
  );
}
