import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/bad-request';
import { Controller } from '../protocols/controller';
import { HttpRequest } from '../protocols/httpRequest';
import { HttpResponse } from '../protocols/httpResponse';

export class SignInController implements Controller {
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { email, password } = httpRequest.body;
		const requiredFields = ['email', 'password'];

		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}
	}
}