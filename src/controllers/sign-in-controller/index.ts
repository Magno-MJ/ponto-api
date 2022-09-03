import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/bad-request';
import { Controller } from '../protocols/controller';
import { HttpRequest } from '../protocols/httpRequest';
import { HttpResponse } from '../protocols/httpResponse';
import { EmailValidator } from './protocols/email-validator';

export class SignInController implements Controller {
	constructor(private readonly emailValidator: EmailValidator) {}	
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const requiredFields = ['email', 'password'];

		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		}

		const { email, password } = httpRequest.body;

		const emailIsValid = this.emailValidator.validate(email);

		if(!emailIsValid) {
			return badRequest(new InvalidParamError('email'));
		}
	}
}