import crypto from 'crypto';
import { storage } from '../storage';

interface SpribeGameSession {
  sessionId: string;
  userId: number;
  gameId: string;
  balance: string;
  currency: string;
  createdAt: Date;
  expiresAt: Date;
}

interface SpribeTokenData {
  userId: number;
  sessionId: string;
  balance: string;
  currency: string;
  gameUrl: string;
}

export class SpribeService {
  private activeSessions: Map<string, SpribeGameSession> = new Map();
  private readonly gameUrl = 'https://api.spribe.io/v2/game/aviator';
  private readonly operatorId = process.env.SPRIBE_OPERATOR_ID || 'demo_operator';
  private readonly secretKey = process.env.SPRIBE_SECRET_KEY || 'demo_secret';

  // Generate secure game token for user
  async generateGameToken(userId: number): Promise<SpribeTokenData> {
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sessionId = crypto.randomUUID();
    const balance = await storage.getUserBalance(userId);
    
    // Create game session
    const session: SpribeGameSession = {
      sessionId,
      userId,
      gameId: 'aviator',
      balance,
      currency: user.country === 'Uganda' ? 'UGX' : 'SSP',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
    };

    this.activeSessions.set(sessionId, session);

    // Generate signed token for Spribe
    const tokenData = {
      operator_id: this.operatorId,
      user_id: userId.toString(),
      session_id: sessionId,
      balance: parseFloat(balance),
      currency: session.currency,
      game_id: 'aviator',
      timestamp: Math.floor(Date.now() / 1000),
      return_url: `${process.env.SITE_URL || 'http://localhost:5000'}/casino`
    };

    const token = this.signToken(tokenData);
    
    const gameUrl = `${this.gameUrl}?token=${token}&lang=en&operator=${this.operatorId}`;

    return {
      userId,
      sessionId,
      balance,
      currency: session.currency,
      gameUrl
    };
  }

  // Sign token with HMAC for security
  private signToken(data: any): string {
    const payload = Buffer.from(JSON.stringify(data)).toString('base64');
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');
    
    return `${payload}.${signature}`;
  }

  // Verify token from Spribe callbacks
  verifyToken(token: string): any {
    const [payload, signature] = token.split('.');
    
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }
    
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  }

  // Handle balance check from Spribe
  async getBalance(sessionId: string): Promise<{ balance: number; currency: string }> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    if (new Date() > session.expiresAt) {
      this.activeSessions.delete(sessionId);
      throw new Error('Session expired');
    }

    const currentBalance = await storage.getUserBalance(session.userId);
    
    return {
      balance: parseFloat(currentBalance),
      currency: session.currency
    };
  }

  // Handle bet placement from Spribe
  async placeBet(sessionId: string, amount: number, betId: string): Promise<{ success: boolean; balance: number; transactionId: string }> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const currentBalance = parseFloat(await storage.getUserBalance(session.userId));
    
    if (currentBalance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct bet amount
    const newBalance = (currentBalance - amount).toFixed(2);
    await storage.updateUserBalance(
      session.userId, 
      `-${amount}`, 
      'aviator_bet', 
      `Aviator bet: ${betId}`,
      parseInt(betId)
    );

    return {
      success: true,
      balance: parseFloat(newBalance),
      transactionId: `bet_${betId}_${Date.now()}`
    };
  }

  // Handle win payout from Spribe
  async payoutWin(sessionId: string, amount: number, betId: string): Promise<{ success: boolean; balance: number; transactionId: string }> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add win amount
    await storage.updateUserBalance(
      session.userId, 
      amount.toFixed(2), 
      'aviator_win', 
      `Aviator win: ${betId}`,
      parseInt(betId)
    );

    const newBalance = await storage.getUserBalance(session.userId);

    return {
      success: true,
      balance: parseFloat(newBalance),
      transactionId: `win_${betId}_${Date.now()}`
    };
  }

  // Clean up expired sessions
  cleanupExpiredSessions(): void {
    const now = new Date();
    const expiredSessions: string[] = [];
    
    this.activeSessions.forEach((session, sessionId) => {
      if (now > session.expiresAt) {
        expiredSessions.push(sessionId);
      }
    });
    
    expiredSessions.forEach(sessionId => {
      this.activeSessions.delete(sessionId);
    });
  }

  // Get session info
  getSession(sessionId: string): SpribeGameSession | undefined {
    return this.activeSessions.get(sessionId);
  }
}

export const spribeService = new SpribeService();

// Clean up expired sessions every hour
setInterval(() => {
  spribeService.cleanupExpiredSessions();
}, 60 * 60 * 1000);