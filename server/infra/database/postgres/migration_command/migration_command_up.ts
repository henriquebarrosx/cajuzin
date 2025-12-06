import { join } from 'path';

import type { Database } from '../main';
import { createMigrationsTable, getExecutedMigrations, getPendingMigrationsFileName, migrationsDir } from './common';

export async function runMigrations(database: Database): Promise<void> {
	await createMigrationsTable(database);

	const executed = await getExecutedMigrations(database);
	const pending: string[] = await getPendingMigrationsFileName(executed);

	if (pending.length === 0) {
		console.log('Non pending migrations\n');
		return;
	}

	console.log('\n')
	console.log(`Running ${pending.length} pending migrations:`);

	for (const file of pending) {
		console.log(`  ○ ${file}`)
	}

	for (const file of pending) {
		await executeMigration(database, file);
	}

	console.log('\n');
	console.log('All migrations has been executed successfully')
	console.log('\n');
}

async function executeMigration(database: Database, filename: string) {
	try {
		await database.transaction(async (transaction) => {
			const filePath = join(migrationsDir, filename);
			await transaction.file(filePath);
			await transaction`INSERT INTO migrations (name) VALUES (${filename});`;
		});
	}

	catch (error) {
		console.log('\n')
		console.log(`Failed running migration: ${filename}`);
		console.log('\n')
		console.log(error)
		console.log('\n')
		throw error;
	}
}