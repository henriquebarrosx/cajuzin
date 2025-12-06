import { logger } from '#infra/logger/main.ts';
import { createPostgresDatabase } from '#infra/database/postgres/main.ts';
import { runMigrations } from '#infra/database/postgres/migration_command/migration_command_up.ts';
import { printPendingMigrations } from '#infra/database/postgres/migration_command/migration_command_status.ts';
import { revertLastMigration, revertMigrations } from '#infra/database/postgres/migration_command/migration_command_down.ts';

const database = createPostgresDatabase({ logger });
const command = process.argv[2];

switch (command) {
	case 'up':
		await runMigrations(database)
		process.exit(0);
	case 'down':
		await revertLastMigration(database);
		process.exit(0);
	case 'destroy':
		await revertMigrations(database);
		process.exit(0);
	case 'status':
		await printPendingMigrations(database);
		process.exit(0);
	default:
		logger.info('[Database] Available commands: up, down, destroy, status');
}