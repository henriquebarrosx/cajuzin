import { SQL } from 'bun';

import type { Logger } from "#infra/logger/main.ts";

type Providers = {
	logger: Logger;
}

export type Database = SQL;

export function createPostgresDatabase({ logger }: Providers): Database {
	logger.info('[PostgresDatabase] Establishing connection');

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error('Cannot establish database connection: url not defined');

	const database = new SQL(
		{
			url: connectionString,
			connectionTimeout: 30,
			onclose(error) {
				logger.error("[PostgresDatabase] Connection failed:", error);
				process.exit(1);
			},
		}
	);

	logger.info('[PostgresDatabase] Connection established');

	return database;
}