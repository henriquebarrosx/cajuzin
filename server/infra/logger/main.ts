import Pino from 'pino';
import { threadId } from "worker_threads";

export const logger = createLogger();

export type Logger = {
	info(message: string, ...args: unknown[]): void;
	error(message: string | unknown, ...args: unknown[]): void;
}

export function createLogger(): Logger {

	const pinoLogger = Pino(
		{
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
					colorize: true,
				}
			},
		},
	)

	function info(message: string, ...args: unknown[]): void {
		const extra = args.length ? ` ${args.join(' ')}` : '';
		pinoLogger.info(`[Thread: ${threadId}] - ${message}${extra}`);
	}

	function error(message: string | unknown, ...args: unknown[]): void {
		const extra = args.length ? ` ${args.join(' ')}` : '';
		pinoLogger.error(`[Thread: ${threadId}] - ${message}${extra}`);
	}

	return {
		info,
		error,
	}
}