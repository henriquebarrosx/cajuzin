import { join } from 'path';

import type { Database } from "../main";
import { getExecutedMigrations, migrationsDir } from './common';

export async function revertLastMigration(database: Database): Promise<void> {
	const executed = await getExecutedMigrations(database);

	if (executed.length === 0) {
		console.log('Non migration to be reverted');
		console.log('\n')
		return;
	}

	const lastMigrationFileName = executed[executed.length - 1]!;
	await revertMigration(database, lastMigrationFileName);
}

export async function revertMigrations(database: Database): Promise<void> {
	const executed = await getExecutedMigrations(database);

	if (executed.length === 0) {
		console.log('Non migration to be reverted');
		console.log('\n')
		return;
	}

	const migrationsDescendingOrder = [...executed].sort(sortByDescendingOrder)

	for (const migration of migrationsDescendingOrder) {
		await revertMigration(database, migration);
	}
}

function sortByDescendingOrder(previous: string, next: string): number {
	return parseInt(next) - parseInt(previous);
}

async function revertMigration(database: Database, filename: string): Promise<void> {
	console.log(`Reverting migration: ${filename}`);

	try {
		await database.transaction(async (transaction) => {
			const targetFileName = filename.replace('.sql', '.down.sql');
			const filePath = join(migrationsDir, targetFileName);
			await transaction.file(filePath);
			await transaction`DELETE FROM migrations WHERE name = ${filename};`;
		});

		console.log(`Migration reverted successfully: ${filename}`);
	}

	catch (error) {
		console.log('\n')
		console.log(`Failed reverting migration: ${filename}`);
		console.log('\n')
		console.log(error)
		console.log('\n')
		throw error;
	}
}