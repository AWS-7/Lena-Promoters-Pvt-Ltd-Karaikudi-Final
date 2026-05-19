type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(entry: LogEntry): string {
    const base = `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;
    if (entry.context && Object.keys(entry.context).length > 0) {
      return `${base} | Context: ${JSON.stringify(entry.context)}`;
    }
    return base;
  }

  private addLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };

    this.logs.push(entry);

    // Keep only last 1000 logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const formatted = this.formatLog(entry);
    switch (level) {
      case "debug":
        console.debug(formatted);
        break;
      case "info":
        console.info(formatted);
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "error":
        console.error(formatted, error?.stack || "");
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.addLog("debug", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.addLog("info", message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog("warn", message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.addLog("error", message, context, error);
  }

  getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter((log) => log.level === level);
    }
    return filtered.slice(-limit);
  }

  clear() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
