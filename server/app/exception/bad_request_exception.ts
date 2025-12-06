export class BadRequestException extends Error {
	readonly status: number = 400;

	constructor(message: string) {
		super(message);
	}
}