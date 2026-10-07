import pino, { type Logger as PinoLogger, type LoggerOptions } from 'pino';

export interface LoggerConfig {
  serviceName: string;
  level: string;
  environment: string;
  redactPaths?: string[];
}

const DEFAULT_REDACT = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'req.headers.authorization',
  'req.headers.cookie',
  'JWT_SECRET',
  'DEVICE_FINGERPRINT_SALT',
  '*.password',
  '*.token',
  '*.secret',
];

export function createLogger(config: LoggerConfig): PinoLogger {
  const options: LoggerOptions = {
    name: config.serviceName,
    level: config.level,
    base: {
      service: config.serviceName,
      env: config.environment,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: config.redactPaths ?? DEFAULT_REDACT,
      censor: '[REDACTED]',
    },
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    serializers: {
      err: pino.stdSerializers.err,
      req(request: { method: string; url: string; ip?: string }) {
        return {
          method: request.method,
          url: request.url,
          ip: request.ip,
        };
      },
    },
  };

  return pino(options);
}

export type Logger = PinoLogger;
