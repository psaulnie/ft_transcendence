import { User } from '../entities';

export type UserDetails = {
  clientId: string;
  username: string;
};

export type Done = (err: Error, user: User) => void;
