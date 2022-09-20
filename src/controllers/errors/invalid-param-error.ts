export class InvalidParamError extends Error {
	readonly statusCode: number;
	constructor(paramName: string) {
		super(`${paramName} is invalid`);
		this.name = 'InvalidParamError';
		this.statusCode = 400;
	}
}