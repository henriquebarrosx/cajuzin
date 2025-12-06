export class UnprocessableEntityException extends Error {
	readonly status: number = 422;

	constructor(message: string) {
		super(message);
	}
}