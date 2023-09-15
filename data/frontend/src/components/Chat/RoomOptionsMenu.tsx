import { useState } from "react";
import { useSelector } from "react-redux";

import { Menu, MenuItem, Divider } from "@mui/material";

import PasswordDialog from "./PasswordDialog";
import SelectUserDialog from "./SelectUserDialog";

import webSocketManager from "../../webSocket";
import { userRole } from "./chatEnums";
import BanListDialog from "./BanListDialog";

type arg = {
  contextMenu: any;
  setContextMenu: any;
  roomIndex: number;
  roomName: string;
  role: userRole;
};

export default function RoomOptionsMenu({
  contextMenu,
  setContextMenu,
  roomIndex,
  roomName,
  role,
}: arg) {
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showBanListDialog, setShowBanListDialog] = useState(false);

  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);

  const handleClose = () => {
    setContextMenu(null);
  };

  function setPassword() {
    setShowPasswordDialog(true);
    setContextMenu(null);
  }

  function removePassword() {
    webSocketManager.getSocket().emit("removePasswordToRoom", {
      room: roomName,
      source: user.username,
    });
    setContextMenu(null);
  }

  function showDialog() {
    setShowUserDialog(true);
    setContextMenu(null);
  }

  function seeBanList() {
    setShowBanListDialog(true);
    setContextMenu(null);
  }

  if (rooms.index !== roomIndex) return null;
  return (
    <div>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <div>
          {role === userRole.owner ? (
            <div>
              <MenuItem
                disabled={rooms.room[roomIndex].hasPassword !== false}
                onClick={setPassword}
              >
                Set a password
              </MenuItem>
              <MenuItem
                disabled={rooms.room[roomIndex].hasPassword !== true}
                onClick={setPassword}
              >
                Change password
              </MenuItem>
              <MenuItem
                disabled={rooms.room[roomIndex].hasPassword !== true}
                onClick={removePassword}
              >
                Remove password
              </MenuItem>
              <MenuItem onClick={seeBanList}>Ban list</MenuItem>
              <Divider />
            </div>
          ) : null}
          {!rooms.room[roomIndex].isDirectMsg ? (
            <MenuItem onClick={showDialog}>Invite user</MenuItem>
          ) : null}
        </div>
      </Menu>
      {showPasswordDialog ? (
        <PasswordDialog
          open={showPasswordDialog}
          setOpen={setShowPasswordDialog}
          roomName={roomName}
          role={userRole.none}
          createRoom={false}
          setNewRoomName={null}
        />
      ) : null}
      {showUserDialog ? (
        <SelectUserDialog
          open={showUserDialog}
          setOpen={setShowUserDialog}
          roomName={roomName}
        />
      ) : null}
      {showBanListDialog ? (
        <BanListDialog
          open={showBanListDialog}
          setOpen={setShowBanListDialog}
          roomName={roomName}
        />
      ) : null}
    </div>
  );
}
