from .base import BaseAttacker
from .brute_force import BruteForceAttacker, DictionaryAttacker
from .timing_attack import TimingMimicAttacker, JitterInjectionAttacker
from .ai_imitation import GPT4Simulator, ClaudeSimulator, GeminiSimulator
from .replay_attack import SessionReplayAttacker, MosaicAttacker
from .adversarial_ml import GradientAttacker, BoundaryProber
from .swarm_attack import SwarmAttacker

# Registry of all available attackers
ATTACKER_REGISTRY = [
    # Brute Force
    BruteForceAttacker(),
    DictionaryAttacker(),
    
    # AI Imitation
    GPT4Simulator(),
    ClaudeSimulator(),
    GeminiSimulator(),
    
    # Timing
    TimingMimicAttacker(),
    JitterInjectionAttacker(),
    
    # Replay
    SessionReplayAttacker(),
    MosaicAttacker(),
    
    # Adversarial ML
    GradientAttacker(),
    BoundaryProber(),
    
    # Swarm
    SwarmAttacker(),
]

__all__ = [
    "BaseAttacker",
    "ATTACKER_REGISTRY",
    "BruteForceAttacker",
    "DictionaryAttacker",
    "TimingMimicAttacker",
    "JitterInjectionAttacker",
    "GPT4Simulator",
    "ClaudeSimulator",
    "GeminiSimulator",
    "SessionReplayAttacker",
    "MosaicAttacker",
    "GradientAttacker",
    "BoundaryProber",
    "SwarmAttacker",
]
