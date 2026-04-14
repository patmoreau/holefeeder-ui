import { LoggerFactory } from '@/shared/core/logger/logger';

export const loggerFactoryForNoop: LoggerFactory = () => ({
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
});
