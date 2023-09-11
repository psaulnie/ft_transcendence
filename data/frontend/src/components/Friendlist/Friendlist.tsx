import { Box, Grid, Button } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useGetFriendsListQuery } from "../../store/api";
import InGameStatus from "./inGameStatus";
import OnlineStatus from "./onlineStatus";
import OfflineStatus from "./offlineStatus";
import { userStatus } from "./userStatus";
import {useEffect} from "react";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import webSocketManager from "../../webSocket";
import { useSelector } from "react-redux";

function Friendlist() {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const {
    data: userFriendsList,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetFriendsListQuery({});

  useEffect(() => {
    webSocketManager.getSocket().on(webSocketManager.getSocket().id + 'friend', (value: any) => {
      refetch();
    });
    return () => {
      webSocketManager.getSocket().off(webSocketManager.getSocket().id + 'friend');
    }
  });

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  if (isLoading) return <Loading />
  if (isError) return <ErrorSnackbar error={error} />
  if (!userFriendsList)
    return <Navigate to="/home" />

  console.log('friendlist: ', userFriendsList);
  return (
    <div>
      <Box
        sx={{
          position: "fixed",
          transform: "translate(5%, 0%)",
          top: "11.5%",
          width: "90%",
          height: "80.5%",
          padding: "20px",
          borderRadius: "3em",
          overflow: "hidden",
          background: "#d6d4d4",
          border: "1px solid #000000",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
            paddingRight: "12px",
            marginRight: "-12px",
          }}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >

            {userFriendsList.map((friend: any) => {
              switch (friend.status) {
                case userStatus.playing:
                  return <InGameStatus key={friend.username} username={friend.username} refetch={refetch}/>;
                case userStatus.online:
                  return <OnlineStatus key={friend.username} username={friend.username} refetch={refetch}/>;
                case userStatus.offline:
                  return <OfflineStatus key={friend.username} username={friend.username} refetch={refetch}/>;
                default:
                  return null;
              }
            })}

            <Grid
              item
              xs
              sx={{ width: "100%", height: "100%", marginTop: "0.25em" }}
            >
              <Button
                onClick={handleProfileClick}
                variant="contained"
                color="primary"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "18px",
                  width: "6em",
                  height: "1.5em",
                  backgroundColor: "rgba(220, 220, 220, 0.9)",
                  border: "1px solid #020202",
                  borderRadius: "1em",
                  marginTop: "0.3em",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "grey",
                    borderColor: "red",
                  },
                }}
              >
                Back
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default Friendlist;
