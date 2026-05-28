export interface Order {
  id: string;
  trade_id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: "LIMIT" | "MARKET";
  product: "DELIVERY" | "INTRADAY";
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "REJECTED";
  timestamp: number;
}

export interface PositionUpdate {
  order_id: string;
  pnl: number;
  m2m: number;
  unrealized: number;
  health: "HEALTHY" | "WARNING" | "CRITICAL";
  timestamp: number;
}

export interface TradeScore {
  trade_id: string;
  pnl: number;
  attribution: {
    bull: number;
    bear: number;
    judge: number;
  };
  lessons: string;
}

export interface Report {
  period: "DAILY" | "WEEKLY";
  pnl: number;
  trades: number;
  metrics: Record<string, number>;
  alerts: string[];
}

export interface Directive {
  target_agent: string;
  action: string;
  reason: string;
  timestamp: number;
}
