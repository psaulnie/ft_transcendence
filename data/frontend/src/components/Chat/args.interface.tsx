export interface manageRoomsArgs {
	type: number,
	source: string,
	room: string,
	access: number
}

export interface sendMsgArgs {
	type: number,
	source: string,
	target: string,
	data: string,
	isDirectMessage: boolean
}

export interface actionArgs {
	source: string,
	target: string,
	room: string
}

export interface chatResponseArgs {
	source: string,
	target: string,
	action: number,
	data: string,
	role: string,
	isMuted: boolean,
	date: Date,
}
