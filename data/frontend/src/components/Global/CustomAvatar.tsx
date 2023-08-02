import { useState } from "react";

import { Avatar, Skeleton } from "@mui/material";
import Error from "./Error";

export default function CustomAvatar({username}: {username: string}) {

	const url = "http://localhost:5000/api/avatar?username=" + username;
	return (
		<Avatar sx={{ width: '200px', height: '200px' }} src={url}/>
	);
}