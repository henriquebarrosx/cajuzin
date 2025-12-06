import type { Database } from "../main";
import { createMigrationsTable, getExecutedMigrations, getPendingMigrationsFileName } from "./common";

export async function printPendingMigrations(database: Database) {
	await createMigrationsTable(database);

	const executed = await getExecutedMigrations(database);
	const pending: string[] = await getPendingMigrationsFileName(executed);

	if (pending.length === 0 && executed.length === 0) {
		console.log('\nNon migration found\n');
		return
	}

	for (const migration of executed) {
		console.log(`  ○ [ EXECUTED ] ${migration}`);
	}

	for (const migration of pending) {
		console.log(`  ○ [ PENDING ] ${migration}`);
	}

	console.log(`\nTotal: ${executed.length} executed, ${pending.length} pending\n`);
}