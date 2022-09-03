import { SignInController } from '.';
import { MissingParamError } from '../errors/missing-param-error';

interface SutTypes {
	sut: SignInController
}
function makeSut(): SutTypes {
	const sut = new SignInController();
	return { sut };
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
});