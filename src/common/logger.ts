import winston from 'winston';
import path from 'path';
import { env } from './env';

const LOG_PATH: string = process.env.LOG_PATH ?? path.join(__dirname, '..', '..');

const { combine, timestamp, json, errors } = winston.format;

const errorFilter = winston.format(info => {
  return info.level === 'error' ? info : false;
});

const infoFilter = winston.format(info => {
  return info.level === 'info' ? info : false;
});

const DEFAULT_LOG_LEVEL = env() === 'dev' ? 'debug' : 'info';

const LOG_TRANSPORTS = (): any[] => {
  const _base = [new winston.transports.Console()];
  return env() === 'dev' ? _base : [
    ..._base,
    new winston.transports.File({
      filename: path.join(LOG_PATH, 'app-error.log'),
      level: 'error',
      format: combine(errorFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: path.join(LOG_PATH, 'app-info.log'),
      level: 'info',
      format: combine(infoFilter(), timestamp(), json()),
    })
  ];
};

const LOG_FORMAT = () => (
  env() === 'dev' ? combine(winston.format.cli(), errors({stack: true}), timestamp()) : combine(errors({ stack: true }), timestamp(), json())
);

export const LOGGER = winston.createLogger({
  level: process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL,
  format: LOG_FORMAT(),
  transports: LOG_TRANSPORTS(),
});
