import { SignInController } from '.';

describe('SignInController', () => {
	it('should return 400 if no email is provided', async () => {
		const sut = new SignInController();
		const httpRequest = {
			body: {
				password: 'fake-password'
			}
		};

		const response = await sut.handle(httpRequest);

		expect(response.statusCode).toBe(400);
		expect(response.body).toEqual({
			message: 'Email is required'
		});
	});
});