import { Box, Grid, Button, Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetUserAchievementsQuery } from "../../../store/api";
import Completed from "./Completed";
import ToComplete from "./ToComplete";

function Achievements() {
  const navigate = useNavigate();
  const { username } = useParams();

  const handleProfileClick = () => {
    navigate("/profile/" + username);
  };

  const {
    data: userAchievements,
    isLoading,
    isError,
  } = useGetUserAchievementsQuery({ username });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>; // TODO handle error
  if (userAchievements.exist === false) return <Navigate to="/home" />;

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
          {
            userAchievements.achievements.achievement1 === true ? (
              <Completed
                title="Victorious"
                description="Win your first game!"
              />
            ) : (
              <ToComplete
                title="Victorious"
                description="Win your first game!"
              />
            )
          }
          {
            userAchievements.achievements.achievement2 === true ? (
              <Completed
                title="Winner"
                description="Win 10 games!"
              />
            ) : (
              <ToComplete
                title="Winner"
                description="Win 10 games!"
              />
            )
          }
          {
            userAchievements.achievements.achievement3 === true ? (
              <Completed
                title="Sociable"
                description="Add a friend!"
              />
            ) : (
              <ToComplete
                title="Sociable"
                description="Add a friend!"
              />
            )
          }
          {
            userAchievements.achievements.achievement4 === true ? (
              <Completed
                title="Addict"
                description="Play 50 games!"
              />
            ) : (
              <ToComplete
                title="Addict"
                description="Play 50 games!"
              />
            )
          }
          {
            userAchievements.achievements.achievement5 === true ? (
              <Completed
                title="Designer"
                description="Change background!"
              />
            ) : (
              <ToComplete
                title="Designer"
                description="Change background!"
              />
            )
          }

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
                border: "2px solid #020202",
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

export default Achievements;
