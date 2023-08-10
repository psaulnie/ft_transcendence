import { Avatar } from "@mui/material";

export default function CustomAvatar({username}: {username: string}) {

	const url = "http://localhost:5000/api/avatar/" + username;
	return (
		<Avatar src={url}/>
	);
}