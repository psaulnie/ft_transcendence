import React, { useEffect, useState } from "react";
import { chatSocket } from "../../chatSocket";

import { Dialog, DialogTitle, DialogActions, Button, Zoom, TextField, Autocomplete, Skeleton, DialogContent } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import { useDispatch, useSelector } from "react-redux";

import { useGetFilteredUserListQuery } from "../../store/api";

import Error from "../Global/Error";

type arg = {
	open: boolean,
	setOpen: any,
	roomName: string
};

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
	  children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>,
  ) {
	return <Zoom ref={ref} {...props} style={{ transitionDelay: '100ms' }} />;
  });

export default function SelectUserDialog({open, setOpen, roomName}: arg) {
	const user = useSelector((state: any) => state.user);
	const [selectedUser, setSelectedUser] = useState('');

	function updateUser(e: any, value: any) {
		if (!value || value.label === null)
			setSelectedUser('');
		else
			setSelectedUser(value.label);
	}

	function closeUserDialog(e: any) {
		e.preventDefault();
		setOpen(false);
	}

	function confirmButton(e: any) {
		e.preventDefault();
		chatSocket.emit('inviteUser', {roomName: roomName, username: selectedUser});
		setOpen(false);
	}

	const {
		data: usersList,
		isLoading,
		isError,
		error,
		refetch
	} = useGetFilteredUserListQuery({username: user.username, roomName: roomName});

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (isError)
		return (<Error error={error} />)
	if (isLoading)
		return (
			<Skeleton variant="rectangular" />
		);
	

	return (
		<Dialog open={open} onClose={closeUserDialog} TransitionComponent={Transition} keepMounted>
			<DialogTitle>
				Choose an user:
			</DialogTitle>
			<DialogContent>
				<Autocomplete
					options={usersList}
					sx={{ width: 300 }}	
					renderInput={(params: any) => <TextField {...params} label="User" value={params}/>}
					value={selectedUser} onChange={updateUser}
					isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeUserDialog}>Cancel</Button>
				<Button disabled={selectedUser === '' ? true : false} onClick={confirmButton}>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
};