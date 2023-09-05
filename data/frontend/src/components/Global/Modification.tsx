import { Box, Grid, Button, Avatar, Typography, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Modification() {
  const navigate = useNavigate();

  	const handleProfileClick = () => {
    	navigate("/profile");
	};

  const user = useSelector((state: any) => state.user);
  const urlAvatar = `http://${process.env.REACT_APP_IP}:5000/api/avatar/${user.username}`;

  return (
    <div>
      {/* <UploadButton /> */}
      <Box
        sx={{
          position: "fixed",
          transform: "translate(5%, 0%)",
          top: "25%",
          width: "90%",
          height: "50%",
          padding: "1em",
          borderRadius: "3em",
          background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
          border: "2px solid #000000",
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
          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: 18,
                fontWeight: "bold",
                marginRight:'7em',
                color: "black",
                marginLeft: "auto",
              }}
            >
              Username:
            </Typography>
          </Grid>

          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <TextField placeholder=". . ." size='small' 
              sx={{backgroundColor:'#F8F8F8',
                '& input': {
                color: 'black', // Set the text color to black
                },
              }}>
            </TextField>
          </Grid>
          
            
          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
              marginTop='0.5em'
            >
              <Grid item xs={6} sx={{ backgroundColor: "" }}>
                <Avatar
                  src={urlAvatar}
                  alt="User Avatar"
                  sx={{ marginLeft: "0.5em", width: "5em", height: "5em" }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ backgroundColor: "", marginTop: "0.2em" }}
              >
                <Button sx={{border:'black solid', borderRadius:'1em', borderWidth:'2px', backgroundColor:'#F8F8F8'}}>
                  Download new image
                </Button>
              </Grid>
            </Grid>
          </Grid>


          <Grid
            item
            xs
            marginTop='1em'
            sx={{ width: "100%", height: "100%",}}
          >
            <Button
              onClick={handleProfileClick}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: "18px",
                width: "6em",
                height: "1.5em",
                backgroundColor: "rgba(220, 220, 220, 0.9)",
                border: "1px solid #020202",
                borderRadius: "1em",
                color: "black",
                "&:hover": {
                  backgroundColor: "grey",
                  borderColor: "red",
                },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: "18px",
                marginLeft:'1em',
                width: "6em",
                height: "1.5em",
                backgroundColor: "rgba(220, 220, 220, 0.9)",
                border: "1px solid #020202",
                borderRadius: "1em",
                color: "black",
                "&:hover": {
                  backgroundColor: "grey",
                  borderColor: "red",
                },
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Modification;
