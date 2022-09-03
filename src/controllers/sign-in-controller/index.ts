import { Controller } from '../protocols/controller';
import { HttpRequest } from '../protocols/httpRequest';
import { HttpResponse } from '../protocols/httpResponse';

export class SignInController implements Controller {
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { email, password } = httpRequest.body;

		if(!email) {
			return {
				statusCode: 400,
				body: {
					message: 'Email is required'
				}
			};
		}

		if(!password) {
			return {
				statusCode: 400,
				body: {
					message: 'Password is required'
				}
			};

		}
	}
}