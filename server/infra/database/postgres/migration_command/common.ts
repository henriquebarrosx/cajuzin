import { join } from "path";
import { readdir } from "fs/promises";

import type { Database } from "../main";
import type { Migration } from "./migration.dto";

export const migrationsDir = join(process.cwd(), 'server', 'db', 'migrations');

export async function createMigrationsTable(database: Database): Promise<void> {
	await database`
		CREATE TABLE IF NOT EXISTS migrations (
			id SERIAL PRIMARY KEY,
			name VARCHAR(255) UNIQUE NOT NULL,
			executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`;
}

export async function getExecutedMigrations(database: Database): Promise<string[]> {
	const migrations: Migration[] = await database`SELECT name FROM migrations ORDER BY id ASC`;
	return migrations.map(({ name }) => name);
}

export async function getPendingMigrationsFileName(executedMigrations: string[]): Promise<string[]> {
	const allFiles = (await readdir(migrationsDir))
		.filter(file => file.endsWith('.sql') && !file.endsWith('.down.sql'))
		.sort();

	return allFiles.filter(file => !executedMigrations.includes(file));
}