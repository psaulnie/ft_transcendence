import { UserDetails } from '../../utils/types';
import { User } from '../../entities';

export interface AuthProvider {
  validateUser(details: UserDetails);
  createUser(details: UserDetails);
  findUser(intraId: string): Promise<User> | undefined;
}
