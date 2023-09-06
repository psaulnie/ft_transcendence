import {
  Box,
  Grid,
  Button,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useUploadAvatarMutation } from "../../store/api";
import webSocketManager from "../../webSocket";

function Modification() {
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadAvatar] = useUploadAvatarMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] !== undefined) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        alert("Only images are allowed");
        setSelectedFile(undefined);
        setFileUrl("");
      } else if (e.target.files[0].size > 1024 * 1024 * 5) {
        alert("Image is too large");
        setSelectedFile(undefined);
        setFileUrl("");
      } else {
        setSelectedFile(e.target.files[0]);
        setFileUrl(URL.createObjectURL(e.target.files[0]));
      }
    }
  };

  const saveChanges = () => {
    const formData = new FormData();
    if (selectedFile !== undefined) {
      formData.append("username", user.username);
      formData.append("file", selectedFile);
      uploadAvatar(formData);
    }
    if (newUsername !== "" && newUsername.length < 10) {
      webSocketManager.getSocket()?.emit('changeUsername', newUsername);
      setNewUsername("");
    }
  };

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`);
  };

  const urlAvatar = `http://${process.env.REACT_APP_IP}:5000/api/avatar/${user.username}`;

  return (
    <div>
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
                marginRight: "7em",
                color: "black",
                marginLeft: "auto",
              }}
            >
              Username:
            </Typography>
          </Grid>

          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <TextField
              placeholder=". . ."
              size="small"
              autoComplete='off'
              value={newUsername}
              onChange={(e) =>
                e.target.value.length < 10
                  ? setNewUsername(e.target.value)
                  : null
              }
              sx={{
                backgroundColor: "#F8F8F8",
                "& input": {
                  color: "black", // Set the text color to black
                },
              }}
            ></TextField>
          </Grid>

          <Grid item xs sx={{ width: "100%", height: "100%" }}>
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
              marginTop="0.5em"
            >
              <Grid item xs={6} sx={{ backgroundColor: "" }}>
                <Avatar
                  src={fileUrl ? fileUrl : urlAvatar}
                  alt="User Avatar"
                  sx={{ marginLeft: "0.5em", width: "5em", height: "5em" }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ backgroundColor: "", marginTop: "0.2em" }}
              >
                <Button
                  sx={{
                    border: "black solid",
                    borderRadius: "1em",
                    borderWidth: "2px",
                    backgroundColor: "#F8F8F8",
                  }}
                  component="label"
                >
                  <input type="file" onChange={handleFileChange}
                  hidden />
                  Download new image
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs marginTop="1em" sx={{ width: "100%", height: "100%" }}>
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
                marginLeft: "1em",
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
              onClick={saveChanges}
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
