import { useGetUsersInRoomQuery } from "../../store/api";
import { useEffect } from "react";

import { Grid, Skeleton, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

export default function UsersList({roomName}: {roomName: string}) {
	const dispatch = useDispatch();
	const {
		data: usersList,
		isLoading,
		isError,
		error,
		refetch
	} = useGetUsersInRoomQuery({roomName: roomName});
	
	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isError) // TODO fix show real error page (make Error component)
	return (<p>Error: {error.toString()}</p>)
	else if (isLoading)
	return (
		<div>
				<Skeleton variant="text"/>
				<Skeleton variant="rectangular" />
			</div>
		);
		
	console.log(usersList.data[0]);
	return (
		<Grid>
			{
				usersList.data.map((user: any) => {
					return (
						<Typography>{user.username}</Typography>
					);
				})
			}
		</Grid>
	);
};