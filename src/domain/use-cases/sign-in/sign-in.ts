import { AuthenticatedUserDTO } from './dtos/authenticated-user-dto';
import { UserDTO } from './dtos/user-dto';

export interface SignIn {
  signIn(userData: UserDTO): Promise<AuthenticatedUserDTO>
}