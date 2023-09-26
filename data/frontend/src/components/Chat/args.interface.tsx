import {userRole} from "./chatEnums";

export interface sendMsgArgs {
  type: number;
  source: string;
  target: string;
  data: string;
}

export interface chatResponseArgs {
  source: string;
  target: string;
  action: number;
  data: any;
  role: userRole;
  isMuted: boolean;
  hasPassword: boolean;
  newUsername: string;
  listener: string;
}
