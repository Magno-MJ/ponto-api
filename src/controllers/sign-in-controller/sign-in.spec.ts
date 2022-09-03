import { SignInController } from '.';
import { InvalidParamError } from '../errors/invalid-param-error';
import { MissingParamError } from '../errors/missing-param-error';
import { EmailValidator } from './protocols/email-validator';

interface SutTypes {
	sut: SignInController
	emailValidatorStub: EmailValidator
}

function makeEmailValidatorStub(): EmailValidator {
	class EmailValidatorStub implements EmailValidator {
		validate(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
}
function makeSut(): SutTypes {
	const emailValidatorStub: EmailValidator = makeEmailValidatorStub();
	const sut = new SignInController(emailValidatorStub);
	return { sut, emailValidatorStub };
}

describe('SignInController', () => {
	it('should return 400 if no email is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: 'fake-password'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(new MissingParamError('email'));
	});

	it('should return 400 if no password is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(new MissingParamError('password'));
	});

	it('should call EmailValidator with a correct email', async () => {
		const { sut, emailValidatorStub } = makeSut();
		const validateSpy = jest.spyOn(emailValidatorStub, 'validate');

		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com',
				password: 'fake-password'
			}
		};

		await sut.handle(httpRequest);

		expect(validateSpy).toHaveBeenCalledTimes(1);
		expect(validateSpy).toHaveBeenCalledWith('fake-mail@mail.com');
	});

	it('should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false);
		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com',
				password: 'fake-password'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual(new InvalidParamError('email'));
	});
});