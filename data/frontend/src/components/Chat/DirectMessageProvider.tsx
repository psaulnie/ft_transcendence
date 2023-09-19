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
      if (value.action !== actionTypes.left) {
        dispatch(
          addRoom({
            name: value.source,
            role: userRole.none,
            isDirectMsg: true,
            hasPassword: false,
            openTab: false,
            isMuted: false,
          })
        );
        dispatch(addMsg({ name: value.source, message: value }));
      }
      dispatch(setRead(rooms.index));
    }

    function newUsername(value: chatResponseArgs) {
      dispatch(
        updateRoomName({ oldName: value.source, newName: value.target })
      );
    }

    webSocketManager.getSocket().on("newUsername", newUsername);
    webSocketManager.getSocket().on(user.username, onMsgSent);
    return () => {
      webSocketManager.getSocket().off(user.username, onMsgSent);
      webSocketManager.getSocket().off("newUsername", newUsername);
    };
  }, [user, dispatch, rooms]);

  return null;
}
