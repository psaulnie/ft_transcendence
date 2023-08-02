import { useState } from "react";

import { Avatar, Skeleton } from "@mui/material";
import Error from "./Error";

export default function CustomAvatar({username}: {username: string}) {

	const url = "http://localhost:5000/api/avatar/" + username;
	return (
		<Avatar src={url}/>
	);
}