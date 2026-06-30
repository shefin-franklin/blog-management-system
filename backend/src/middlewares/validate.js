import { ApiError } from '../utils/api.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  const parsed = schema.safeParse(req[source]);

  if (!parsed.success) {
    return next(
      new ApiError(
        422,
        'Validation failed',
        parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      ),
    );
  }

  req[source] = parsed.data;
  return next();
};
