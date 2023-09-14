import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { Delete, VideogameAsset } from "@mui/icons-material";
import webSocketManager from "../../webSocket";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router";

function InGameStatus({username, refetch}: {username: string, refetch: any}) {
  const urlAvatar = `http://${process.env.REACT_APP_IP}:5000/api/avatar/${username}`;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  return (
    <Grid
      item
      xs
      sx={{ backgroundColor: "", width: "100%", height: "90%" }}
    >
      <Box
        sx={{
          background: "linear-gradient(to right, #FE8F29, #FEAB5D, #FE8F29)",
          borderWidth: '1px 0',
          borderStyle: 'solid',
          borderImage: 'linear-gradient(to right, #d6d4d4, #00000000, #d6d4d4)',
          borderImageSlice: '1 0',
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          marginTop: "0.5em",
          padding: "0.1em",
        }}
      >
        <Grid
          container
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: "nowrap" }}
          justifyContent="space-between"
        >
          <Grid
            container
            item
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Avatar
                src={urlAvatar}
                alt="User Avatar"
                sx={{
                  width: "2em",
                  height: "2em",
                  border: "black solid",
                  borderWidth: "1px",
                  borderRadius: "3em",
                  marginLeft: "1.5em",
                  marginRight: "0.3em",
                  cursor: 'pointer',
                }}
                onClick={() => {navigate(`/profile/${username}`)}}
              />
            </Grid>

            <Grid item>
              <Typography
                variant="h6"
                align="left"
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "black",
                  transform: "translate(0%, 10%)",
                  cursor: 'pointer',
                }}
                onClick={() => {navigate(`/profile/${username}`)}}
              >
                {username}
              </Typography>
              <Typography
                variant="h6"
                align="left"
                sx={{
                  fontSize: 14,
                  color: "black",
                  transform: "translate(0%, -4%)",
                }}
              >
                <VideogameAsset
                  sx={{ fontSize: "16px", transform: "translate(0%, 18%)" }}
                />{" "}
                In game
              </Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              onClick={() => {
                webSocketManager.getSocket()?.emit("removeFriend", {
                  source: user.username,
                  target: username,
                });
              }}
              sx={{
                backgroundColor: "#d4d4d4",
                border: "black solid",
                borderRadius: "10px",
                borderWidth: "1px",
                width: "30px",
                height: "30px",
                minWidth: "5px",
                marginRight: "2em",
              }}
            >
              <Delete sx={{ fontSize: 20 }} />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
 );
}

export default InGameStatus;
