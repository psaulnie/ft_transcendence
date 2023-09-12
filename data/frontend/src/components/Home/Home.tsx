import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, Grid, Button, Typography, Avatar } from "@mui/material";

import { useGetLeaderboardQuery, useGetMyProfileQuery } from "../../store/api";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import { useEffect } from "react";

export default function Home() {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const play = () => {
    navigate("/game");
  };

  const {
    data: userProfile,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMyProfileQuery({});

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
    error: errorLeaderboard,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardQuery({});

  useEffect(() => {
    if (localStorage.getItem("user")) {
      refetch();
      refetchLeaderboard();
    }
  });

  if (isLoading || isLoadingLeaderboard) return <Loading />;
  if (isError) return <ErrorSnackbar error={error} />;
  if (isErrorLeaderboard) return <ErrorSnackbar error={errorLeaderboard} />;

  return (
    <Grid
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50%",
          }}
        >
          <Grid item sx={{ marginBottom: "1em" }}>
            <Button
              variant="text"
              color="primary"
              onClick={play}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                fontSize: "36px",
                width: "6em",
                height: "1.8em",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "#000000",
                border: "1px solid",
                borderRadius: "10px",
                color: "black",
                "&:hover": {
                  backgroundColor: "gray",
                  borderColor: "gray",
                },
              }}
            >
              Play
            </Button>
          </Grid>
          <Grid item>
            <Box
              sx={{
                top: "56%",
                left: "25%",
                width: "15em",
                height: "10em",
                padding: "0.5em",
                borderRadius: "1.5em",
                background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
                border: "1px solid #000000",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
                display={"block"}
              >
                Welcome {userProfile.username}
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
                display={"block"}
              >
                Wins: {userProfile.wins}
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
                display={"block"}
              >
                Losses: {userProfile.loses}
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
                display={"block"}
              >
                Rank: {userProfile.rank}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              sx={{
                top: "56%",
                left: "25%",
                width: "15em",
                height: "10em",
                padding: "0.5em",
                borderRadius: "1.5em",
                background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
                border: "1px solid #000000",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
                display={"block"}
              >
                Leaderboard
              </Typography>
              <Grid sx={{ overflow: "auto" }}>
                {leaderboard.map((user: any, index: number) => {
                  return (
                    <Grid item key={index} sx={{display: 'block'}}>
                      <Box
                        // alignItems={"center"}
                        // justifyContent={"center"}
                        sx={{
                          // display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#454545",
                          marginTop: "1%",
                        }}
                      >
                        <Avatar
                          src={`http://${process.env.REACT_APP_IP}:5000/api/avatar/${user.username}`}
                        />
                        <Typography color={"black"}>{user.username}</Typography>
                        {index === 0 ? (
                          <Typography color={"black"} display={"inline"}>👑</Typography>
                        ) : (
                          <></>
                        )}
                        {index === 1 ? (
                          <Typography color={"black"} display={"inline"}>🥈</Typography>
                        ) : (
                          <></>
                        )}
                        {index === 2 ? (
                          <Typography color={"black"} display={"inline"}>🥉</Typography>
                        ) : (
                          <></>
                        )}
                        <div>
                          <Typography color={"black"} display={"block"}>
                            Score: {user.score}
                          </Typography>
                        </div>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}
