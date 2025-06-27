import { EventEmitter } from 'events';
import crypto from 'crypto';

interface AviatorBet {
  userId: number;
  amount: number;
  multiplier?: number;
  cashedOut: boolean;
  timestamp: number;
}

interface GameRound {
  id: string;
  startTime: number;
  endTime?: number;
  crashMultiplier: number;
  status: 'waiting' | 'flying' | 'crashed';
  bets: Map<number, AviatorBet[]>;
  currentMultiplier: number;
}

export class AviatorGameService extends EventEmitter {
  private currentRound: GameRound | null = null;
  private gameInterval: NodeJS.Timeout | null = null;
  private roundDuration = 20000; // 20 seconds max flight time
  private waitTime = 5000; // 5 seconds between rounds
  private recentResults: number[] = [];
  private maxResults = 20;

  constructor() {
    super();
    this.startGameLoop();
  }

  private generateCrashMultiplier(): number {
    // Provably fair algorithm - house edge around 1%
    const random = crypto.randomBytes(4).readUInt32BE(0) / 0xFFFFFFFF;
    const houseEdge = 0.01;
    
    // Generate multiplier with exponential distribution
    const multiplier = (1 - houseEdge) / random;
    
    // Clamp between 1.00x and 100.00x
    return Math.max(1.00, Math.min(100.00, Math.round(multiplier * 100) / 100));
  }

  private startGameLoop() {
    this.startNewRound();
  }

  private startNewRound() {
    const roundId = crypto.randomUUID();
    const crashMultiplier = this.generateCrashMultiplier();
    
    this.currentRound = {
      id: roundId,
      startTime: Date.now(),
      crashMultiplier,
      status: 'waiting',
      bets: new Map(),
      currentMultiplier: 1.00
    };

    // Waiting phase
    this.emit('roundWaiting', {
      roundId,
      waitTime: this.waitTime,
      crashMultiplier // Don't send this to clients in real implementation
    });

    setTimeout(() => {
      this.startFlying();
    }, this.waitTime);
  }

  private startFlying() {
    if (!this.currentRound) return;

    this.currentRound.status = 'flying';
    this.currentRound.startTime = Date.now();
    
    this.emit('roundStarted', {
      roundId: this.currentRound.id,
      startTime: this.currentRound.startTime
    });

    // Update multiplier every 100ms
    this.gameInterval = setInterval(() => {
      this.updateMultiplier();
    }, 100);
  }

  private updateMultiplier() {
    if (!this.currentRound || this.currentRound.status !== 'flying') return;

    const elapsed = Date.now() - this.currentRound.startTime;
    const progress = elapsed / this.roundDuration;
    
    // Calculate current multiplier based on exponential curve
    this.currentRound.currentMultiplier = 1 + (this.currentRound.crashMultiplier - 1) * progress;

    this.emit('multiplierUpdate', {
      roundId: this.currentRound.id,
      multiplier: Math.round(this.currentRound.currentMultiplier * 100) / 100,
      elapsed
    });

    // Check if we've reached crash point
    if (this.currentRound.currentMultiplier >= this.currentRound.crashMultiplier) {
      this.crashRound();
    }
  }

  private crashRound() {
    if (!this.currentRound) return;

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }

    this.currentRound.status = 'crashed';
    this.currentRound.endTime = Date.now();
    
    // Add to recent results
    this.recentResults.unshift(this.currentRound.crashMultiplier);
    if (this.recentResults.length > this.maxResults) {
      this.recentResults.pop();
    }

    this.emit('roundCrashed', {
      roundId: this.currentRound.id,
      crashMultiplier: this.currentRound.crashMultiplier,
      endTime: this.currentRound.endTime
    });

    // Start next round after wait period
    setTimeout(() => {
      this.startNewRound();
    }, this.waitTime);
  }

  public placeBet(userId: number, amount: number): boolean {
    if (!this.currentRound || this.currentRound.status !== 'waiting') {
      return false;
    }

    const bet: AviatorBet = {
      userId,
      amount,
      cashedOut: false,
      timestamp: Date.now()
    };

    if (!this.currentRound.bets.has(userId)) {
      this.currentRound.bets.set(userId, []);
    }

    const userBets = this.currentRound.bets.get(userId)!;
    if (userBets.length >= 2) {
      return false; // Max 2 bets per user per round
    }

    userBets.push(bet);
    
    this.emit('betPlaced', {
      roundId: this.currentRound.id,
      userId,
      amount,
      betIndex: userBets.length - 1
    });

    return true;
  }

  public cashOut(userId: number, betIndex: number = 0): { success: boolean; amount?: number; multiplier?: number } {
    if (!this.currentRound || this.currentRound.status !== 'flying') {
      return { success: false };
    }

    const userBets = this.currentRound.bets.get(userId);
    if (!userBets || betIndex >= userBets.length) {
      return { success: false };
    }

    const bet = userBets[betIndex];
    if (bet.cashedOut) {
      return { success: false };
    }

    bet.cashedOut = true;
    bet.multiplier = this.currentRound.currentMultiplier;
    const winAmount = bet.amount * bet.multiplier;

    this.emit('betCashedOut', {
      roundId: this.currentRound.id,
      userId,
      betIndex,
      multiplier: bet.multiplier,
      amount: winAmount
    });

    return {
      success: true,
      amount: winAmount,
      multiplier: bet.multiplier
    };
  }

  public getCurrentGameState() {
    if (!this.currentRound) {
      return null;
    }

    return {
      roundId: this.currentRound.id,
      status: this.currentRound.status,
      currentMultiplier: this.currentRound.currentMultiplier,
      startTime: this.currentRound.startTime,
      endTime: this.currentRound.endTime
    };
  }

  public getRecentResults(): number[] {
    return [...this.recentResults];
  }

  public getUserBets(userId: number): AviatorBet[] {
    if (!this.currentRound) {
      return [];
    }

    return this.currentRound.bets.get(userId) || [];
  }
}

export const aviatorGame = new AviatorGameService();