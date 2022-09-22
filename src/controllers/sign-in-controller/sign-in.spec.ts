import { SignInController } from '.';
import { AuthenticatedUserDTO } from '../../domain/use-cases/sign-in/dtos/authenticated-user-dto';
import { UserDTO } from '../../domain/use-cases/sign-in/dtos/user-dto';
import { SignIn } from '../../domain/use-cases/sign-in/sign-in';
import { InternalServerError } from '../errors/internal-server-error';
import { EmailValidator } from './protocols/email-validator';

interface SutTypes {
	sut: SignInController
	emailValidatorStub: EmailValidator
	signInUseCaseStub: SignIn
}

function makeEmailValidatorStub(): EmailValidator {
	class EmailValidatorStub implements EmailValidator {
		validate(email: string): boolean {
			return true;
		}
	}

	return new EmailValidatorStub();
}

function makeSignInUseCaseStub(): SignIn {
	class SignInUseCaseStub implements SignIn {
		async signIn(userData: UserDTO): Promise<AuthenticatedUserDTO> {
			return Promise.resolve({
				id: 'fake-id',
				name: 'fake-name',
				email: 'fake-mail@mail.com',
				created_at: 'fake-date',
				token: 'fake-token',
				refresh_token: 'fake-refresh-token'
			});
		}

	}

	return new SignInUseCaseStub();
}

function makeSut(): SutTypes {
	const emailValidatorStub: EmailValidator = makeEmailValidatorStub();
	const signInUseCaseStub: SignIn = makeSignInUseCaseStub();
	const sut = new SignInController(emailValidatorStub, signInUseCaseStub);

	return { sut, emailValidatorStub, signInUseCaseStub };
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
		expect(response.body).toEqual('email is required');
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
		expect(response.body).toEqual('password is required');
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
		expect(response.body).toEqual('email is invalid');
	});

	it('should return 500 if EmailValidator throws', async() => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
			throw new InternalServerError();
		});

		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com',
				password: 'fake-password'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(500);
		expect(response.body).toEqual('internal server error');
	});

	it('should call SignInUseCase with correct values', async () => {
		const { sut, signInUseCaseStub } = makeSut();

		const signInSpy = jest.spyOn(signInUseCaseStub, 'signIn');

		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com',
				password: 'fake-password'
			}
		};

		await sut.handle(httpRequest);

		expect(signInSpy).toHaveBeenCalledTimes(1);
		expect(signInSpy).toHaveBeenCalledWith({ email: 'fake-mail@mail.com', password: 'fake-password' });
	});

	it('should return 404 if no user was found', async () => {
		const { sut, signInUseCaseStub } = makeSut();

		jest.spyOn(signInUseCaseStub, 'signIn').mockImplementationOnce(() => {
			class NotFoundError extends Error {
				readonly statusCode: number;
				constructor(entityName: string) {
					super(`${entityName} not found`);
					this.name = 'UserNotFoundError';
					this.statusCode = 404;
				}
			}

			throw new NotFoundError('user');
		});

		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com',
				password: 'fake-password'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(404);
		expect(response.body).toBe('user not found');
	});

	it('should return 400 if the password is wrong', async () => {
		const { sut, signInUseCaseStub } = makeSut();

		jest.spyOn(signInUseCaseStub, 'signIn').mockImplementationOnce(() => {
			class WrongDataError extends Error {
				readonly statusCode: number;
				constructor(data: string) {
					super(`${data} is wrong`);
					this.name = 'WrongDataError';
					this.statusCode = 400;
				}
			}

			throw new WrongDataError('password');
		});

		const httpRequest = {
			body: {
				email: 'fake-mail@mail.com',
				password: 'fake-password'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(400);
		expect(response.body).toBe('password is wrong');
	});
});