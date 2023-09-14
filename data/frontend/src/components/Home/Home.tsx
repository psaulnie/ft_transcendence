import { useNavigate } from "react-router-dom";

import {Box, Grid, Button, Typography, Avatar} from "@mui/material";

import { useGetLeaderboardQuery } from "../../store/api";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import { useEffect } from "react";
import {useSelector} from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);

  const play = () => {
    navigate("/game");
  };

  const {
    data: leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isErrorLeaderboard,
    error: errorLeaderboard,
    refetch: refetchLeaderboard,
  } = useGetLeaderboardQuery({});

  useEffect(() => {
    if (localStorage.getItem("user")) {
      refetchLeaderboard();
    }
  }, [refetchLeaderboard]);

  if (isLoadingLeaderboard) return <Loading />;
  if (isErrorLeaderboard) return <ErrorSnackbar error={errorLeaderboard} />;

  return (
    <Grid
      container
      direction='column'
      sx={{
        position: "absolute",
        height: '94%',
        width: '100%',
      }}
    >
      <Grid item sx={{ marginLeft: '1em', marginTop: '1em' }}>
        <Typography align="left" sx={{ color: "#D4D4D4", textShadow: '1px 1px 4px #000000', fontWeight: "bold", fontSize: "30px", marginLeft: '0.2em' }}>Welcome {user.username}</Typography>
      </Grid>

      <Grid item sx={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, 0%)' }}>
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
            backgroundColor: "#d6d4d4",
            border: "1px solid #00000088",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
            color: "black",
            "&:hover": {
              backgroundColor: "#FE8F29",
            },
          }}
        >
          Play
        </Button>
      </Grid>

      <Grid item sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, 0%)' }}>
        <Box
          sx={{
            width: "30em",
            height: "14em",
            borderRadius: "1.5em",
            background: "#d6d4d450",
            backdropFilter: 'blur(8px)',
            border: "1px solid #00000088",
            paddingTop: '10px',
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Typography sx={{ color: "black", fontWeight: "bold", fontSize: "24px", marginBottom: '10px' }}>Leaderboard</Typography>

          <Grid sx={{ overflow: "auto" }}>
            {leaderboard.map((user: any, index: number) => {
              return (
                <Grid container key={index} alignItems="center" justifyContent="center"
                  sx={{
                    background: "linear-gradient(to right, #45454500, #454545AA, #454545FF, #454545AA, #45454500)",
                    borderWidth: '1px 0',
                    borderStyle: 'solid',
                    borderImage: 'linear-gradient(to right, #00000000, #d6d4d4, #00000000)',
                    borderImageSlice: '1 0',
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    marginBottom: '0.5em'
                  }}
                >
                  <Grid item container alignItems="center" justifyContent="center">
                    <Avatar src={`http://${import.meta.env.VITE_IP}:5000/api/avatar/${user.username}`}/>
                    <Typography color="black" sx={{ margin: '0 8px 0 18px' }}>{user.username}</Typography>
                    {(() => {
                      switch (index) {
                        case 0:
                          return <Typography color="black" sx={{ margin: '0 8px' }}>👑</Typography>;
                        case 1:
                          return <Typography color="black" sx={{ margin: '0 8px' }}>🥈</Typography>;
                        case 2:
                          return <Typography color="black" sx={{ margin: '0 8px' }}>🥉</Typography>;
                        default:
                          return null;
                      }
                    })()}
                    <Typography color="black" sx={{ margin: '0 8px' }}>Score: {user.score}</Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>

        </Box>
      </Grid>

    </Grid>
  );
}
