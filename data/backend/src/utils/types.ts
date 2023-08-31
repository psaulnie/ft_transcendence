import { User } from '../entities';

export type UserDetails = {
  intraId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  urlAvatar: string;
  intraUsername: string;
};

export type Done = (err: Error, user: User) => void;
