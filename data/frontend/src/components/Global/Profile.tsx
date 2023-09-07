import { Box, Grid, Button, Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "../../store/api";
import Loading from "./Loading";
import ErrorSnackbar from "./ErrorSnackbar";

function Profile() {
  const { username } = useParams();
  const user = useSelector((state: any) => state.user);
  const urlAvatar = `http://${process.env.REACT_APP_IP}:5000/api/avatar/${username}`;

  const navigate = useNavigate();
  const {
    data: userProfile,
    isLoading,
    error,
    isError,
  } = useGetUserProfileQuery({ username }, { skip: !username });

  const handleAchievementsClick = () => {
    navigate(`/profile/${username}/achievements`);
  };

  const handleFriendsClick = () => {
    navigate("/friendlist");
  };

  const handleModificationClick = () => {
    navigate(`/edit`);
  };
  if (isLoading) return <Loading />;
  if (isError) return <ErrorSnackbar error={error} />;
  if (userProfile.exist === false) return <Navigate to="/home" />;
  return (
    <div>
      <Box
        sx={{
          position: "fixed",
          transform: "translate(5%, 0%)",
          top: "12%",
          width: "90%",
          height: "60%",
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
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
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
                sx={{
                  backgroundColor: "",
                  marginTop: "0.2em",
                  transform: "translate(-7%, 0%)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontSize: 30, fontWeight: "bold", color: "black" }}
                >
                  {userProfile.username}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 30, fontWeight: "bold", color: "black" }}
                >
                  Rank: {userProfile.rank}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            sx={{ backgroundColor: "", width: "100%", height: "100%" }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: 28,
                fontWeight: "bold",
                textDecoration: "underline",
                color: "black",
              }}
            >
              STATS
            </Typography>
          </Grid>
          <Grid
            item
            xs
            sx={{
              backgroundColor: "",
              width: "100%",
              height: "90%",
              marginTop: "-0.5em",
            }}
          >
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontSize: 24, color: "black" }}>
                  Wins: {userProfile.wins}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ fontSize: 24, color: "black" }}>
                  Loses: {userProfile.loses}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs
            sx={{
              backgroundColor: "",
              width: "100%",
              height: "100%",
              marginTop: "-0.4em",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: 24, color: "black" }}>
              Match history:
            </Typography>
          </Grid>
          <Grid
            item
            xs
            sx={{
              backgroundColor: "",
              width: "100%",
              height: "30%",
              marginTop: "-0.4em",
            }}
          >
            <Box
              sx={{
                overflow: "auto",
                height: "6.3em",
                padding: "0.3em",
                display: "grid",
                gap: "0.5em",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#454545",
                  color: "black",
                  height: "1.5em",
                }}
              >
                <Grid container spacing={0}>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.2em",
                    }}
                  ></Box>
                  <Typography
                    sx={{ color: "#1ABAFF", marginLeft: "2em", fontSize: 20 }}
                  >
                    {" "}
                    4{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.4em", fontSize: 20, color: "black" }}
                  >
                    {" "}
                    :{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.5em", fontSize: 20, color: "#FC7D07" }}
                  >
                    {" "}
                    2{" "}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.4em",
                    }}
                  ></Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#454545",
                  color: "black",
                  height: "1.5em",
                }}
              >
                <Grid container spacing={0}>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.2em",
                    }}
                  ></Box>
                  <Typography
                    sx={{ color: "#1ABAFF", marginLeft: "2em", fontSize: 20 }}
                  >
                    {" "}
                    9{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.4em", fontSize: 20, color: "black" }}
                  >
                    {" "}
                    :{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.5em", fontSize: 20, color: "#FC7D07" }}
                  >
                    {" "}
                    0{" "}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.4em",
                    }}
                  ></Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#454545",
                  color: "black",
                  height: "1.5em",
                }}
              >
                <Grid container spacing={0}>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.2em",
                    }}
                  ></Box>
                  <Typography
                    sx={{ color: "#FC7D07", marginLeft: "2em", fontSize: 20 }}
                  >
                    {" "}
                    3{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.4em", fontSize: 20, color: "black" }}
                  >
                    {" "}
                    :{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.5em", fontSize: 20, color: "#1ABAFF" }}
                  >
                    {" "}
                    4{" "}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.4em",
                    }}
                  ></Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  backgroundColor: "#454545",
                  color: "black",
                  height: "1.5em",
                }}
              >
                <Grid container spacing={0}>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.2em",
                    }}
                  ></Box>
                  <Typography
                    sx={{ color: "#1ABAFF", marginLeft: "2em", fontSize: 20 }}
                  >
                    {" "}
                    4{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.4em", fontSize: 20, color: "black" }}
                  >
                    {" "}
                    :{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.5em", fontSize: 20, color: "#FC7D07" }}
                  >
                    {" "}
                    2{" "}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.4em",
                    }}
                  ></Box>
                </Grid>
              </Box>
              <Box
                sx={{
                  backgroundColor: "454545",
                  color: "black",
                  height: "1.5em",
                }}
              >
                <Grid container spacing={0}>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.2em",
                    }}
                  ></Box>
                  <Typography
                    sx={{ color: "#1ABAFF", marginLeft: "2em", fontSize: 20 }}
                  >
                    {" "}
                    4{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.4em", fontSize: 20, color: "black" }}
                  >
                    {" "}
                    :{" "}
                  </Typography>
                  <Typography
                    sx={{ marginLeft: "0.5em", fontSize: 20, color: "#FC7D07" }}
                  >
                    {" "}
                    2{" "}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: "#D9D9D9",
                      border: "black solid",
                      borderWidth: "1px",
                      height: "1.5em",
                      width: "1.5em",
                      borderRadius: "3em",
                      marginLeft: "2.4em",
                    }}
                  ></Box>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAchievementsClick}
        sx={{
          textTransform: "none",
          fontWeight: "bold",
          fontSize: "20px",
          width: "10em",
          height: "1.4em",
          position: "fixed",
          border: "2px solid #000000",
          transform: "translate(-50%, 0%)",
          backgroundColor: "rgba(220, 220, 220, 0.9)",
          borderRadius: "1em",
          top: "74%",
          color: "black",
          "&:hover": {
            backgroundColor: "grey",
            borderColor: "red",
          },
        }}
      >
        Achievements
      </Button>
      {user.username === username ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFriendsClick}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "20px",
            width: "10em",
            height: "1.4em",
            position: "fixed",
            transform: "translate(-50%, 0%)",
            backgroundColor: "rgba(220, 220, 220, 0.9)",
            border: "2px solid #000000",
            borderRadius: "1em",
            top: "80.5%",
            color: "black",
            "&:hover": {
              backgroundColor: "grey",
              borderColor: "red",
            },
          }}
        >
          Friends
        </Button>
      ) : null}
      {user.username === username ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleModificationClick}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "20px",
            width: "10em",
            height: "1.4em",
            position: "fixed",
            transform: "translate(-50%, 0%)",
            backgroundColor: "rgba(220, 220, 220, 0.9)",
            border: "2px solid #000000",
            borderRadius: "1em",
            top: "87%",
            color: "black",
            "&:hover": {
              backgroundColor: "grey",
              borderColor: "red",
            },
          }}
        >
          Change profile
        </Button>
      ) : null}
    </div>
  );
}

export default Profile;
