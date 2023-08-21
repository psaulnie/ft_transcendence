import { User } from '../entities';

export type UserDetails = {
  clientId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  urlAvatar: string;
};

export type Done = (err: Error, user: User) => void;
