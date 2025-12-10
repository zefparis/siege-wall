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
    <div className="relative w-full h-full min-h-screen lg:min-h-full bg-bg-primary grid-bg overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* Background Effects */}
      <MatrixRain />
      <AttackGlobe />
      
      {/* Desktop Layout (lg+) - Original grid layout */}
      <div className="hidden lg:grid relative z-10 w-full h-full p-4 grid-cols-12 grid-rows-6 gap-4">
        {/* Header Row */}
        <div className="col-span-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-2xl text-cyan tracking-wider">
              HCS-U7 SIEGE WALL
            </h1>
            <ConnectionStatus />
            <VerifyButton />
          </div>
          <div className="text-text-secondary text-sm font-mono">
            COGNITIVE AUTHENTICATION DEFENSE SYSTEM
          </div>
        </div>

        {/* Main Counter - Center Top */}
        <div className="col-span-12 row-span-1 flex flex-col items-center justify-center">
          <MainCounter />
        </div>

        {/* Left Panel - Stats */}
        <div className="col-span-3 row-span-3 flex flex-col gap-4">
          <StatsPanel />
          <HallOfShame />
        </div>

        {/* Center - Shield and Key Metrics */}
        <div className="col-span-6 row-span-3 flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center gap-12 w-full">
            <SuccessRate />
            <IntegrityShield />
            <UptimeCounter />
          </div>
          <ActiveDefenses />
        </div>

        {/* Right Panel - Attack Stream */}
        <div className="col-span-3 row-span-3">
          <AttackStream />
        </div>

        {/* Bottom - Timeline */}
        <div className="col-span-12 row-span-1">
          <Timeline />
        </div>
      </div>

      {/* Mobile/Tablet Layout (< lg) - Scrollable vertical layout */}
      <div className="lg:hidden relative z-10 w-full p-3 flex flex-col gap-4">
        {/* Header Row */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-lg sm:text-xl text-cyan tracking-wider">
              HCS-U7 SIEGE WALL
            </h1>
            <ConnectionStatus />
            <VerifyButton />
          </div>
        </header>

        {/* Main Counter */}
        <section className="flex flex-col items-center justify-center py-2">
          <MainCounter />
        </section>

        {/* Center - Shield and Key Metrics */}
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <SuccessRate />
            <IntegrityShield />
            <UptimeCounter />
          </div>
          <ActiveDefenses />
        </div>

        {/* Stats Panel */}
        <StatsPanel />

        {/* Attack Stream */}
        <div className="min-h-[250px]">
          <AttackStream />
        </div>

        {/* Hall of Shame */}
        <HallOfShame />

        {/* Timeline */}
        <Timeline />
      </div>
    </div>
  );
}
