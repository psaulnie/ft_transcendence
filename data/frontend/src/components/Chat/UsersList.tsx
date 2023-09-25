import {
  useGetUsersInRoomQuery,
  useLazyGetIsMutedQuery,
  useLazyGetUserFriendsListQuery,
} from "../../store/api";

import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";

import {
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PersonIcon from "@mui/icons-material/Person";

import UserOptionsMenu from "./Message/UserOptionsMenu";
import CustomAvatar from "../Global/CustomAvatar";
import {userRole} from "./chatEnums";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import Loading from "../Global/Loading";

export default function UsersList({
  isDirectMessage,
  roomName,
  role,
}: {
  isDirectMessage: boolean;
  roomName: string;
  role: userRole;
}) {
  const user = useSelector((state: any) => state.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const {
    data: usersListData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersInRoomQuery({roomName: roomName}, {skip: isDirectMessage});

  const [trigger, result] = useLazyGetUserFriendsListQuery();
  const [triggerIsMuted, resultIsMuted] = useLazyGetIsMutedQuery();

  let usersList: any[];
  if (!isDirectMessage) usersList = usersListData;
  else
    usersList = [
      { username: user.username, role: userRole.none, isMuted: false },
      { username: roomName.replace('⌲', ''), role: userRole.none, isMuted: false },
    ];

  const handleContextMenu = (event: React.MouseEvent, username: string, cUser: any) => {
    event.preventDefault();
    if (!isDirectMessage) {
      refetch();
    }
    if (user.username !== username) {
      setSelectedUser(cUser);
      setContextMenu(
        contextMenu === null
          ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
          : null
      );
      trigger({});
      if (!isDirectMessage)
        triggerIsMuted({roomName: roomName, username: username});
    }
  };

  function getRoleIcon(role: userRole) {
    if (role === userRole.owner) return <StarIcon/>;
    else if (role === userRole.admin) return <StarOutlineIcon/>;
    else return <PersonIcon/>;
  }

  useEffect(() => {
    if (!isDirectMessage) refetch();
  }, [isDirectMessage, refetch]);

  if (isError && !isDirectMessage) return <ErrorSnackbar error={error}/>;
  if (resultIsMuted.isError && !isDirectMessage) return <ErrorSnackbar error={result.error}/>;
  if (result.isError) return <ErrorSnackbar error={result.error}/>;
  if (isLoading && !isDirectMessage) return <Loading/>;
  if (result.isLoading) return <Loading/>;
  if (resultIsMuted.isLoading && !isDirectMessage) return <Loading/>;

  return (
    <Grid sx={{overflow: 'auto'}}>
      <List>
        {usersList.map((cUser: any, key: number) => {
          return (
            <Tooltip key={key}
                     title={
                       cUser.role === userRole.owner
                         ? "Owner"
                         : cUser.role === userRole.admin
                           ? "Admin"
                           : "User"
                     }
            >
              <ListItem disablePadding dense>
                <ListItemButton
                  onClick={(e) => handleContextMenu(e, cUser.username, cUser)}
                >
                  <ListItemAvatar>
                    <CustomAvatar username={cUser.username}/>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        display="block"
                        fontWeight={
                          cUser.username === user.username ? "bold" : "normal"
                        }
                      >
                        {cUser.username}
                      </Typography>
                    }
                  />
                  <ListItemIcon>
                    {getRoleIcon(cUser.role)}
                  </ListItemIcon>
                </ListItemButton>
                {cUser.username !== user.username && selectedUser !== null ? (
                  <UserOptionsMenu
                    cUser={selectedUser}
                    role={role}
                    roomName={roomName}
                    contextMenu={contextMenu}
                    setContextMenu={setContextMenu}
                    showAdminOpt={true}
                    friendList={result}
                  />
                ) : null}
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    </Grid>
  );
}
