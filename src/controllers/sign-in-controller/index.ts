import { SignIn } from '../../domain/use-cases/sign-in/sign-in';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { error } from '../helpers/error';
import { success } from '../helpers/success';
import { Controller } from '../protocols/controller';
import { HttpRequest } from '../protocols/httpRequest';
import { HttpResponse } from '../protocols/httpResponse';
import { EmailValidator } from './protocols/email-validator';

export class SignInController implements Controller {
	constructor(private readonly emailValidator: EmailValidator, private readonly signInUseCase: SignIn) {}	
	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		try {
			const requiredFields = ['email', 'password'];

			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					throw new MissingParamError(field);
				}
			}

			const { email, password } = httpRequest.body;

			const emailIsValid = this.emailValidator.validate(email);

			if(!emailIsValid) {
				throw new InvalidParamError('email');
			}

			const authenticatedUser = await this.signInUseCase.signIn({ email, password });

			return success(authenticatedUser, 200);
		} catch(err) {
			return error(err);
		}
	}
}