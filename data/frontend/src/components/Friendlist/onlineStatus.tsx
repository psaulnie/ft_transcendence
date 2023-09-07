import {Box, Button, Grid, Typography} from "@mui/material";
import {Adjust, Delete, VideogameAsset} from "@mui/icons-material";

function onlineStatus({username}: {username: string}) {
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
          <Grid item>
            <Box
              sx={{
                backgroundColor: "#D9D9D9",
                border: "black solid",
                borderWidth: "1px",
                height: "2.5em",
                width: "2.5em",
                borderRadius: "3em",
                marginLeft: "0.3em",
                marginRight: "0.3em",
              }}
            ></Box>
          </Grid>

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
