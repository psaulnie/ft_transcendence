import { userRole } from "./chatEnums";

export interface manageRoomsArgs {
  source: string;
  room: string;
  access: number;
}

export interface sendMsgArgs {
  type: number;
  source: string;
  target: string;
  data: string;
}

export interface actionArgs {
  source: string;
  target: string;
  room: string;
}

export interface chatResponseArgs {
  source: string;
  target: string;
  action: number;
  data: string;
  role: userRole;
  isMuted: boolean;
  hasPassword: boolean;
  newUsername: string;
}
