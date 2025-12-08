import winston from 'winston';
import { CONFIG } from '../config';

export const logger = winston.createLogger({
  level: CONFIG.log.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...rest }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(rest).length ? JSON.stringify(rest) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: CONFIG.log.file }),
  ],
});
