// Mirror of the backend contract (svc docs/superpowers/specs §5.2 / §5.3).

export interface AccountSummary {
  id: string;
  accountNumber: string;
  accountType: string;
  status: string;
}

export interface PositionDto {
  symbol: string;
  description: string;
  side: 'LONG' | 'SHORT';
  netQty: number;
  avgPrice: number;
  markPrice: number;
  pointValue: number;
  notional: number;
  unrealizedPnl: number;
}

export type RiskLevel = 'LOW' | 'ELEVATED' | 'HIGH';

export interface SnapshotDto {
  asOf: string;
  session: { open: string; close: string };
  account: {
    id: string;
    accountNumber: string;
    accountType: string;
    status: string;
    balance: number;
  };
  positions: PositionDto[];
  pnl: {
    realizedToday: number;
    commissionsToday: number;
    unrealized: number;
    dayTotal: number;
  };
  risk: { score: number; level: RiskLevel; notional: number; balance: number };
  fillsToday: number;
  lastFillId: string | null;
}

export interface FillEvent {
  id: string;
  accountId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  filledAt: string;
}

/** Response of POST /auth/api/key, kept for the tab in sessionStorage. */
export interface Session {
  apiKey: string;
  expiresAt: string;
  principal: { traderId: string; brokerId: string };
  portalName: string;
}
