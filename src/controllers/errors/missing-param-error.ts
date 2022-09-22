export class MissingParamError extends Error {
	readonly statusCode: number;
	constructor(paramName: string) {
		super(`${paramName} is required`);
		this.name = 'MissingParamError';
		this.statusCode = 400;
	}
}