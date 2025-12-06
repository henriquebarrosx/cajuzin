import { logger } from '#infra/logger/main.ts';
import { createHttpBunServer } from '#infra/http_client/main.ts';
import { createPostgresDatabase } from '#infra/database/postgres/main.ts';

export const database = createPostgresDatabase({ logger });
export const httpClient = createHttpBunServer({ logger });