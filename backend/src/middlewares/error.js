import { logger } from '../utils/logger.js';

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}

export function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, details: err.details });

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal server error' : err.message,
    details: err.details,
  });
}
