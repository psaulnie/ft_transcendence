import { Request } from 'express';
import { User } from '../../entities';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
