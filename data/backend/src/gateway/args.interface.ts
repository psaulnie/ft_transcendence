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
