import { HttpResponse } from '../protocols/httpResponse';

export function badRequest(error: Error): HttpResponse {
	return {
		statusCode: 400,
		body: error
	};
}