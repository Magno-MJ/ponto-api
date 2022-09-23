import { AuthenticatedUserDTO } from '../../domain/use-cases/sign-in/dtos/authenticated-user-dto';
import { UserDTO } from '../../domain/use-cases/sign-in/dtos/user-dto';
import { SignIn } from '../../domain/use-cases/sign-in/sign-in';
import { NotFoundError } from '../errors/not-found-error';
import { UserRepository } from '../protocols/user-repository';

export class SignInUseCase implements SignIn {
	constructor(private readonly userRepository: UserRepository) {}
	async signIn({ email, password }: UserDTO): Promise<AuthenticatedUserDTO> {
		const user = await this.userRepository.findOne(email, password);

		if(!user) {
			throw new NotFoundError('user');
		}

	}
}