import { logger } from '#infra/logger/main.ts';
import { createPostgresDatabase } from '#infra/database/postgres/main.ts';

export const database = createPostgresDatabase({ logger });