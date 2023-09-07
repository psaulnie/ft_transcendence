import { Box, Grid, Button } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useGetFriendsListQuery } from "../../store/api";
import InGameStatus from "./inGameStatus";
import OnlineStatus from "./onlineStatus";
import OfflineStatus from "./offlineStatus";

function Friendlist() {
  const navigate = useNavigate();
  const {
    data: userFriendsList,
    isLoading,
    isError,
  } = useGetFriendsListQuery({});

  console.log('friendlist: ', userFriendsList);

  const handleProfileClick = () => {
    navigate("/profile");
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>; // TODO handle error
  if (!userFriendsList)
    return <Navigate to="/home" />

  return (
    <div>
      <Box
        sx={{
          position: "fixed",
          transform: "translate(5%, 0%)",
          top: "11.5%",
          width: "90%",
          height: "80.5%",
          padding: "0.9em",
          borderRadius: "3em",
          background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
          border: "1px solid #000000",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >

          <InGameStatus username='inGame1' />
          <InGameStatus username='inGame2' />
          <OnlineStatus username='online1' />
          <OnlineStatus username='online2' />
          <OfflineStatus username='offline1' />
          <OfflineStatus username='offline2' />

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
    </div>
  );
}

export default Friendlist;
