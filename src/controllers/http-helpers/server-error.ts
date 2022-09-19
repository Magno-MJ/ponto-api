import { InternalServerError } from '../errors/internal-server-error';

export function serverError() {
	return {
		statusCode: 500,
		body: new InternalServerError()
	};
}