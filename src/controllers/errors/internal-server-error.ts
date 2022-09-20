export class InternalServerError extends Error {
	readonly statusCode: number;
	constructor() {
		super('internal server error');
		this.name = 'InternalServerError';
		this.statusCode = 500;
	}
}