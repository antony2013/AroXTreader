/**
 * Human escalation notification system.
 * Alerts the human overseer on critical events that require manual intervention.
 */

import { createLogger } from "./logger.js";

const log = createLogger("escalation");

export type EscalationSeverity = "CRITICAL" | "WARNING" | "INFO";

export interface EscalationAlert {
  id: string;
  severity: EscalationSeverity;
  category: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

const alertHistory: EscalationAlert[] = [];

/**
 * Send an escalation alert to the human overseer.
 * In production, this should integrate with Slack, email, or PagerDuty.
 * For now, it logs to stderr and stores in memory for the dashboard to display.
 */
export function escalate(alert: Omit<EscalationAlert, "id" | "timestamp">): EscalationAlert {
  const fullAlert: EscalationAlert = {
    ...alert,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  alertHistory.push(fullAlert);

  if (fullAlert.severity === "CRITICAL") {
    log.error(`🚨 ESCALATION [${fullAlert.category}]: ${fullAlert.message}`, fullAlert.metadata);
  } else if (fullAlert.severity === "WARNING") {
    log.warn(`⚠️ ESCALATION [${fullAlert.category}]: ${fullAlert.message}`, fullAlert.metadata);
  } else {
    log.info(`ℹ️ ESCALATION [${fullAlert.category}]: ${fullAlert.message}`, fullAlert.metadata);
  }

  return fullAlert;
}

export function getAlerts(): EscalationAlert[] {
  return [...alertHistory];
}

export function getUnacknowledgedCriticalAlerts(): EscalationAlert[] {
  return alertHistory.filter((a) => a.severity === "CRITICAL");
}

/**
 * Predefined escalation triggers matching the design spec.
 */
export function escalateRiskBreach(reason: string, metadata?: Record<string, unknown>): EscalationAlert {
  return escalate({
    severity: "CRITICAL",
    category: "RISK_BREACH",
    message: reason,
    metadata,
  });
}

export function escalateLowJudgeConfidence(tradeId: string, confidence: number): EscalationAlert {
  return escalate({
    severity: "WARNING",
    category: "LOW_CONFIDENCE",
    message: `Judge confidence ${confidence.toFixed(2)} below threshold on trade ${tradeId}`,
    metadata: { tradeId, confidence },
  });
}

export function escalateServiceInstability(service: string, restarts: number): EscalationAlert {
  return escalate({
    severity: "WARNING",
    category: "SERVICE_INSTABILITY",
    message: `${service} restarted ${restarts} times in 5 minutes`,
    metadata: { service, restarts },
  });
}

export function escalateStrategyDegradation(winRate: number, avgWinRate: number): EscalationAlert {
  return escalate({
    severity: "WARNING",
    category: "STRATEGY_DEGRADATION",
    message: `Win rate dropped to ${(winRate * 100).toFixed(1)}% (avg ${(avgWinRate * 100).toFixed(1)}%)`,
    metadata: { winRate, avgWinRate },
  });
}
