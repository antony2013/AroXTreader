const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 } as const;

type LogLevel = keyof typeof LOG_LEVELS;

function formatLog(level: LogLevel, service: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level}] [${service}] ${message}`;
  if (data !== undefined) {
    return `${base} ${JSON.stringify(data)}`;
  }
  return base;
}

export function createLogger(service: string) {
  return {
    debug: (msg: string, data?: unknown) => console.log(formatLog("DEBUG", service, msg, data)),
    info: (msg: string, data?: unknown) => console.log(formatLog("INFO", service, msg, data)),
    warn: (msg: string, data?: unknown) => console.warn(formatLog("WARN", service, msg, data)),
    error: (msg: string, data?: unknown) => console.error(formatLog("ERROR", service, msg, data)),
  };
}

export type Logger = ReturnType<typeof createLogger>;
