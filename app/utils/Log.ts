// app/core/utils/Logger.ts
import { isDevelopment, isProduction } from '@/app/constants/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: Error;
  userId?: string;
  sessionId?: string;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  enableRemoteLogging: boolean;
  maxStoredLogs: number;
  categories: string[];
  remoteEndpoint?: string;
}

class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private sessionId: string;
  private userId?: string;
  private logQueue: LogEntry[] = [];
  private isInitialized = false;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.config = this.getDefaultConfig();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // ==========================================
  // 🔧 CONFIGURATION
  // ==========================================

  private getDefaultConfig(): LoggerConfig {
    return {
      minLevel: isDevelopment() ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: isDevelopment(),
      enableStorage: true,
      enableRemoteLogging: isProduction(),
      maxStoredLogs: 1000,
      categories: ['*'], // Log all categories by default
      remoteEndpoint: '/api/logs',
    };
  }

  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.isInitialized = true;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public clearUserId(): void {
    this.userId = undefined;
  }

  // ==========================================
  // 🚀 PUBLIC LOGGING METHODS
  // ==========================================

  public debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  public info(category: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  public warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  public error(category: string, message: string, error?: Error, data?: any): void {
    this.log(LogLevel.ERROR, category, message, data, error);
  }

  // ==========================================
  // 🏗️ STRUCTURED LOGGING METHODS
  // ==========================================

  public api = {
    request: (url: string, method: string, data?: any) => {
      this.info('API', `📡 ${method} ${url}`, { method, url, requestData: data });
    },
    response: (url: string, status: number, data?: any) => {
      this.info('API', `📨 ${status} ${url}`, { url, status, responseData: data });
    },
    error: (url: string, error: Error, data?: any) => {
      this.error('API', `❌ ${url} failed`, error, { url, ...data });
    }
  };

  public auth = {
    login: (userId: string) => {
      this.info('AUTH', `🔑 User logged in: ${userId}`, { userId });
      this.setUserId(userId);
    },
    logout: () => {
      this.info('AUTH', `🚪 User logged out: ${this.userId}`, { userId: this.userId });
      this.clearUserId();
    },
    tokenRefresh: () => {
      this.info('AUTH', '🔄 Token refreshed', { userId: this.userId });
    },
    error: (message: string, error?: Error) => {
      this.error('AUTH', `🔒 ${message}`, error);
    }
  };

  public navigation = {
    navigate: (from: string, to: string, params?: any) => {
      this.debug('NAV', `🧭 ${from} → ${to}`, { from, to, params });
    },
    back: (from: string) => {
      this.debug('NAV', `⬅️ Back from ${from}`, { from });
    }
  };

  public data = {
    fetch: (source: string, count?: number) => {
      this.info('DATA', `📥 Fetched from ${source}`, { source, count });
    },
    cache: (source: string, action: 'hit' | 'miss' | 'set') => {
      this.debug('DATA', `💾 Cache ${action}: ${source}`, { source, action });
    },
    error: (source: string, error: Error) => {
      this.error('DATA', `💥 Data error: ${source}`, error, { source });
    }
  };

  public ui = {
    interaction: (component: string, action: string, data?: any) => {
      this.debug('UI', `👆 ${component}: ${action}`, { component, action, ...data });
    },
    render: (component: string, props?: any) => {
      this.debug('UI', `🎨 Rendering ${component}`, { component, props });
    },
    error: (component: string, error: Error) => {
      this.error('UI', `🔴 UI Error in ${component}`, error, { component });
    }
  };

  public performance = {
    start: (operation: string) => {
      this.debug('PERF', `⏱️ Started: ${operation}`, { operation, startTime: Date.now() });
    },
    end: (operation: string, startTime: number) => {
      const duration = Date.now() - startTime;
      this.info('PERF', `✅ Completed: ${operation} (${duration}ms)`, { operation, duration });
    },
    slow: (operation: string, duration: number, threshold: number = 1000) => {
      if (duration > threshold) {
        this.warn('PERF', `🐌 Slow operation: ${operation} (${duration}ms)`, { operation, duration, threshold });
      }
    }
  };

  // ==========================================
  // 🔒 CORE LOGGING ENGINE
  // ==========================================

  private log(level: LogLevel, category: string, message: string, data?: any, error?: Error): void {
    // Check if logging is enabled for this level
    if (level < this.config.minLevel) return;

    // Check if logging is enabled for this category
    if (!this.shouldLogCategory(category)) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
      userId: this.userId,
      sessionId: this.sessionId,
    };

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Storage logging
    if (this.config.enableStorage) {
      this.logToStorage(logEntry);
    }

    // Remote logging
    if (this.config.enableRemoteLogging) {
      this.logToRemote(logEntry);
    }
  }

  private shouldLogCategory(category: string): boolean {
    return this.config.categories.includes('*') || this.config.categories.includes(category);
  }

  // ==========================================
  // 📝 CONSOLE LOGGING
  // ==========================================

  private logToConsole(entry: LogEntry): void {
    const emoji = this.getLevelEmoji(entry.level);
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `${emoji} [${timestamp}] [${entry.category}]`;
    
    const consoleMethod = this.getConsoleMethod(entry.level);
    
    if (entry.error) {
      consoleMethod(`${prefix} ${entry.message}`, entry.data || '', entry.error);
    } else if (entry.data) {
      consoleMethod(`${prefix} ${entry.message}`, entry.data);
    } else {
      consoleMethod(`${prefix} ${entry.message}`);
    }
  }

  private getLevelEmoji(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
      default: return '📝';
    }
  }

  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG: return console.debug;
      case LogLevel.INFO: return console.info;
      case LogLevel.WARN: return console.warn;
      case LogLevel.ERROR: return console.error;
      default: return console.log;
    }
  }

  // ==========================================
  // 💾 STORAGE LOGGING
  // ==========================================

  private async logToStorage(entry: LogEntry): Promise<void> {
    try {
      this.logQueue.push(entry);
      
      // Limit queue size
      if (this.logQueue.length > this.config.maxStoredLogs) {
        this.logQueue = this.logQueue.slice(-this.config.maxStoredLogs);
      }

      // Persist to storage periodically
      if (this.logQueue.length % 10 === 0) {
        await this.persistLogs();
      }
    } catch (error) {
      console.error('Failed to log to storage:', error);
    }
  }

  private async persistLogs(): Promise<void> {
    try {
      const existingLogs = await this.getStoredLogs();
      const allLogs = [...existingLogs, ...this.logQueue];
      
      // Keep only recent logs
      const recentLogs = allLogs.slice(-this.config.maxStoredLogs);
      
      await AsyncStorage.setItem('app_logs', JSON.stringify(recentLogs));
      this.logQueue = [];
    } catch (error) {
      console.error('Failed to persist logs:', error);
    }
  }

  // ==========================================
  // 🌐 REMOTE LOGGING
  // ==========================================

  private async logToRemote(entry: LogEntry): Promise<void> {
    try {
      // Only send ERROR and WARN logs to remote in production
      if (isProduction() && entry.level >= LogLevel.WARN) {
        // Implement remote logging here
        // await this.sendToRemote(entry);
      }
    } catch (error) {
      console.error('Failed to log to remote:', error);
    }
  }

  // ==========================================
  // 📊 LOG MANAGEMENT
  // ==========================================

  public async getStoredLogs(): Promise<LogEntry[]> {
    try {
      const logsJson = await AsyncStorage.getItem('app_logs');
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to get stored logs:', error);
      return [];
    }
  }

  public async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem('app_logs');
      this.logQueue = [];
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  public async exportLogs(): Promise<string> {
    try {
      const logs = await this.getStoredLogs();
      return JSON.stringify(logs, null, 2);
    } catch (error) {
      console.error('Failed to export logs:', error);
      return '';
    }
  }

  public getLogStats(): { total: number; byLevel: Record<LogLevel, number>; byCategory: Record<string, number> } {
    const logs = this.logQueue;
    const stats = {
      total: logs.length,
      byLevel: {
        [LogLevel.DEBUG]: 0,
        [LogLevel.INFO]: 0,
        [LogLevel.WARN]: 0,
        [LogLevel.ERROR]: 0,
        [LogLevel.NONE]: 0,
      },
      byCategory: {} as Record<string, number>,
    };

    logs.forEach(log => {
      stats.byLevel[log.level]++;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
    });

    return stats;
  }

  // ==========================================
  // 🛠️ UTILITIES
  // ==========================================

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }
}

// ==========================================
// 🎯 SINGLETON EXPORT
// ==========================================

export const Log = Logger.getInstance();
export default Log;

// ==========================================
// 📱 REACT NATIVE SPECIFIC UTILITIES
// ==========================================

// Global error handler
export const setupGlobalErrorHandler = () => {
  const originalHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    Log.error('GLOBAL', `Global error (fatal: ${isFatal})`, error);
    
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
};

// Unhandled promise rejection handler
export const setupUnhandledRejectionHandler = () => {
  const tracking = require('promise/setimmediate/rejection-tracking');
  tracking.enable({
    allRejections: true,
    onUnhandled: (id: number, rejection: any) => {
      Log.error('PROMISE', 'Unhandled promise rejection', rejection);
    },
  });
};