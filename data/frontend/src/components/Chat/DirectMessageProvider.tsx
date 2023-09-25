import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatResponseArgs } from "./args.interface";
import { addMsg, addRoom, setRead, updateRoomName } from "../../store/rooms";
import webSocketManager from "../../webSocket";
import { actionTypes } from "./args.types";
import { userRole } from "./chatEnums";

export default function DirectMessageProvider() {
  const user = useSelector((state: any) => state.user);
  const rooms = useSelector((state: any) => state.rooms);
  const dispatch = useDispatch();

  useEffect(() => {
    function onMsgSent(value: chatResponseArgs) {
      const roomName = (value.source > value.target ? value.source + value.target : value.target + value.source);
      if (value.action !== actionTypes.left) {
        dispatch(
          addRoom({
            name: roomName,
            role: userRole.none,
            isDirectMsg: true,
            hasPassword: false,
            openTab: false,
            isMuted: false,
            username: user.username,
          })
        );
        dispatch(addMsg({ name: value.source + '⌲', message: value }));
      }
      dispatch(setRead(rooms.index));
    }

    function newUsername(value: chatResponseArgs) {
      dispatch(
        updateRoomName({ oldName: value.source, newName: value.target })
      );
    }

    webSocketManager.getSocket().on("newUsername", newUsername);
    webSocketManager.getSocket().on(user.username + '⌲', onMsgSent);
    return () => {
      webSocketManager.getSocket().off(user.username + '⌲', onMsgSent);
      webSocketManager.getSocket().off("newUsername", newUsername);
    };
  }, [user, dispatch, rooms]);

  return null;
}
