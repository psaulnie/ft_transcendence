import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { Adjust, Delete } from "@mui/icons-material";

function onlineStatus({username}: {username: string}) {
  const urlAvatar = `http://${process.env.REACT_APP_IP}:5000/api/avatar/${username}`;

  return (
    <Grid
      item
      xs
      sx={{ backgroundColor: "", width: "100%", height: "90%" }}
    >
      <Box
        sx={{
          backgroundColor: "#1ABAFF",
          marginTop: "0.5em",
          borderRadius: "0.5em",
          padding: "0.1em",
          paddingX: "0.4em",
        }}
      >
        <Grid
          container
          spacing={1}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Avatar
            src={urlAvatar}
            alt="User Avatar"
            sx={{
              width: "2em",
              height: "2em",
              border: "black solid",
              borderWidth: "1px",
              borderRadius: "3em",
              marginLeft: "0.3em",
              marginRight: "0.3em",
            }}
          />

          <Grid>
            <Typography
              variant="h6"
              sx={{
                fontSize: 16,
                fontWeight: "bold",
                color: "black",
                marginLeft: "auto",
                marginRight: "1em",
                marginTop: "5px",
                transform: "translate(0%, 14%)",
              }}
            >
              {username}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: 14,
                color: "black",
                marginLeft: "auto",
                marginTop: "auto",
                marginRight: "1.4em",
                transform: "translate(0%, -8%)",
              }}
            >
              <Adjust
                sx={{ fontSize: "16px", transform: "translate(0%, 16%)" }}
              />{" "}
              Online
            </Typography>
          </Grid>

          <Grid>
            <Button
              sx={{
                backgroundColor: "#D9D9D9",
                border: "black solid",
                borderRadius: "1em",
                borderWidth: "1px",
                fontSize: "10px",
                width: "4em",
                height: "2.5em",
                minWidth: "5px",
                paddingX: "24px",
              }}
            >
              <Delete
                sx={{fontSize:20}}
              />
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default onlineStatus;
