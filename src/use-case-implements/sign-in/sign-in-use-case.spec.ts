import { SignInUseCase } from '.';
import { UserRepository } from '../protocols/user-repository';

function makeUserRepositoryStub(): UserRepository {
	class UserRepositoryStub implements UserRepository {
		async findOne(): Promise<{ id: string, email: string, created_at: string, deleted_at: string}> {
			return Promise.resolve({
				id: 'fake-id'  ,
				email: 'fake-email@mail.com',
				created_at: 'string',
				deleted_at: 'string'
			});
		}
	}

	return new UserRepositoryStub();
}

interface SutTypes {
  sut: SignInUseCase
  userRepositoryStub: UserRepository
}
function makeSut(): SutTypes {
	const userRepositoryStub = makeUserRepositoryStub();
	const sut = new SignInUseCase(userRepositoryStub);

	return { sut, userRepositoryStub };
}

describe('SignInUseCase', () => {
	it('should call UserRepository with correct vales', async () => {
		const { sut, userRepositoryStub } = makeSut();
		const findOneSpy = jest.spyOn(userRepositoryStub, 'findOne');

		const userData = {
			email: 'fake-mail@mail.com',
			password: 'fake-password'
		};

		await sut.signIn(userData);

		expect(findOneSpy).toHaveBeenCalledTimes(1);
		expect(findOneSpy).toHaveBeenCalledWith('fake-mail@mail.com','fake-password');
	});
});