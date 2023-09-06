import { useGetUsersInRoomQuery, useLazyGetUserFriendsListQuery } from "../../store/api";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Grid,
  Skeleton,
  ListItem,
  ListItemButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Typography,
} from "@mui/material";

import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PersonIcon from "@mui/icons-material/Person";

import UserOptionsMenu from "./Message/UserOptionsMenu";
import CustomAvatar from "../Global/CustomAvatar";
import { userRole } from "./chatEnums";

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

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const {
    data: usersListData,
    isLoading,
    isError,
    refetch,
  } = useGetUsersInRoomQuery({ roomName: roomName }, { skip: isDirectMessage });

  const [trigger, result] = useLazyGetUserFriendsListQuery();

  let usersList: any[];
  if (!isDirectMessage) usersList = usersListData;
  else
    usersList = [
      { username: user.username, role: userRole.none, isMuted: false },
      { username: roomName, role: userRole.none, isMuted: false },
    ];

  const handleContextMenu = (event: React.MouseEvent, username: string) => {
    event.preventDefault();
    if (!isDirectMessage) refetch();
    if (user.username !== username)
    {
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null,
      );
      trigger({username: user.username});
    }
  };

  function getRoleIcon(role: userRole) {
    if (role === userRole.owner) return <StarIcon />;
    else if (role === userRole.admin) return <StarOutlineIcon />;
    else return <PersonIcon />;
  }

  useEffect(() => {
    if (!isDirectMessage) refetch();
  }, [isDirectMessage, refetch]);

  if (isError && !isDirectMessage) throw new (Error as any)("API call error");
  else if (isLoading && !isDirectMessage)
    return (
      <div>
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" />
      </div>
    );
  return (
    <Grid>
      <List>
        {usersList.map((cUser: any, key: number) => {
          return (
            <ListItem disablePadding dense key={key}>
              <ListItemButton
                onClick={(e) => handleContextMenu(e, cUser.username)}
              >
                <ListItemAvatar>
                  <CustomAvatar username={cUser.username} />
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
                  {user.username === cUser.username
                    ? getRoleIcon(role)
                    : getRoleIcon(cUser.role)}
                </ListItemIcon>
              </ListItemButton>
              {cUser.username !== user.username ? (
                <UserOptionsMenu
                  cUser={cUser}
                  role={role}
                  roomName={roomName}
                  contextMenu={contextMenu}
                  setContextMenu={setContextMenu}
                  showAdminOpt={true}
                  friendList={result}
                />
              ) : null}
            </ListItem>
          );
        })}
      </List>
    </Grid>
  );
}
