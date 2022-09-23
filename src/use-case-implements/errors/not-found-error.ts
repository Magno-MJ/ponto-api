export class NotFoundError extends Error {
	readonly statusCode: number;
	constructor(entityName: string) {
		super(`${entityName} not found`);
		this.name = 'NotFoundError';
		this.statusCode = 404;
	}
}
