import { createLogger, format, transports } from 'winston';

/*
 * Using winstonjs to write log files:
 * import { logger }  from '@hubblecommerce/hubble/core/utils/logger';
 * logger.info("Log message level info");
 * logger.warn("Log message level warning");
 * logger.error("Log message level error");
 *
 * For further information read winston docs: https://github.com/winstonjs/winston
 */

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
    level: 'info',
    format: format.combine(label({ label: 'hubble' }), timestamp(), format.splat(), myFormat),
    defaultMeta: { service: 'hubble' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `system.log`.
        // - Write all logs error (and below) to `error.log`.
        //
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/system.log' }),
    ],
});
