import { logger } from '../utils/logger.js';

export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = {
    success: false,
    message: status === 500 ? 'Internal server error' : err.message,
    details: err.details,
  };

  if (status >= 500) {
    logger.error(err.message, { stack: err.stack, details: err.details });
  } else {
    logger.warn(err.message, {
      status,
      method: req.method,
      path: req.originalUrl,
      details: err.details,
    });
  }

  res.status(status).json(payload);
}
