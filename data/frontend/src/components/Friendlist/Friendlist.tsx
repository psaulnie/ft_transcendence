import {Box, Button, Grid, Typography} from "@mui/material";
import {Navigate, useNavigate} from "react-router-dom";
import {useGetFriendsListQuery} from "../../store/api";
import InGameStatus from "./inGameStatus";
import OnlineStatus from "./onlineStatus";
import OfflineStatus from "./offlineStatus";
import {userStatus} from "./userStatus";
import {useEffect} from "react";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import webSocketManager from "../../webSocket";
import {useSelector} from "react-redux";

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
    webSocketManager
      .getSocket()
      .on(webSocketManager.getSocket().id + "friend", () => {
        refetch();
      });
    return () => {
      webSocketManager
        .getSocket()
        .off(webSocketManager.getSocket().id + "friend");
    };
  });

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  if (isLoading) return <Loading/>;
  if (isError) return <ErrorSnackbar error={error}/>;
  if (!userFriendsList) return <Navigate to="/home"/>;

  const buttonStyle = {
    textTransform: 'none',
    fontSize: '18px',
    width: '5em',
    height: '1.5em',
    position: 'fixed',
    transform: 'translate(-50%, 0%)',
    backgroundColor: '#d6d4d4',
    border: '1px solid #00000088',
    borderRadius: '1em',
    color: 'black',
    '&:hover': {
      backgroundColor: 'grey',
    }
  };

  return (
    <div>
      <Box
        sx={{
          position: "fixed",
          transform: "translate(5%, 0%)",
          top: "11.5%",
          width: "90%",
          height: "70%",
          padding: "1.3em 0 1.3em 0",
          borderRadius: "3em",
          overflow: "hidden",
          background: "#d6d4d470",
          border: "1px solid #00000032",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          backdropFilter: 'blur(8px)',
        }}
      >
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <Grid
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            alignItems="center"
          >

            {userFriendsList.length === 0 ? (
              <Typography color="black">
                Your friends will appear here
              </Typography>
            ) : null}
            {userFriendsList.map((friend: any) => {
              switch (friend.status) {
                case userStatus.playing:
                  return (
                    <InGameStatus
                      key={friend.username}
                      username={friend.username}
                      refetch={refetch}
                    />
                  );
                case userStatus.online:
                  return (
                    <OnlineStatus
                      key={friend.username}
                      username={friend.username}
                      refetch={refetch}
                    />
                  );
                case userStatus.offline:
                  return (
                    <OfflineStatus
                      key={friend.username}
                      username={friend.username}
                      refetch={refetch}
                    />
                  );
                default:
                  return null;
              }
            })}


          </Grid>
        </Box>
      </Box>

      <Button onClick={handleProfileClick} variant="contained" sx={{...buttonStyle, bottom: '10%'}}>
        Back
      </Button>

    </div>
  );
}

export default Friendlist;
