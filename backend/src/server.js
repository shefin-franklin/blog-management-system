import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { createApp } from './app.js';

async function bootstrap() {
  await connectDB();
  const app = await createApp();

  app.listen(env.port, () => {
    logger.info(`API listening on ${env.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
