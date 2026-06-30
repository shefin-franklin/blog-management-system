import app from './app.js';import {connectDB} from './config/db.js';import {env} from './config/env.js';import {logger} from './utils/logger.js';
connectDB().then(()=>app.listen(env.port,()=>logger.info(`API listening on ${env.port}`))).catch(e=>{logger.error(e);process.exit(1)});
