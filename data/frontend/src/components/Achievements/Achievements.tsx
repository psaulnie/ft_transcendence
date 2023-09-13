import { Box, Grid, Button } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetUserAchievementsQuery } from "../../store/api";
import Completed from "./Completed";
import ToComplete from "./ToComplete";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";

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

  if (isLoading) return <Loading />;
  if (isError) return <ErrorSnackbar error={isError} />;
  if (userAchievements.exist === false) return <Navigate to="/home" />;

  return (
    <div>
      <Box
        overflow='auto'
        sx={{
          position: "absolute",
          left: '50%',
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          height: "60%",
          paddingTop: '1.3em',
          borderRadius: "3em",
          background: "#d6d4d450",
          backdropFilter: 'blur(8px)',
          border: "1px solid #00000088",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Grid
          container
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

          <Grid item xs sx={{ width: "100%", height: "100%", marginTop: "0.25em" }}>
            <Button
              onClick={handleProfileClick}
              variant="contained"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: "18px",
                width: "6em",
                height: "1.5em",
                backgroundColor: "#d6d4d4",
                border: "1px solid #00000088",
                borderRadius: "1em",
                marginTop: "0.8em",
                color: "black",
                "&:hover": {
                  backgroundColor: "grey",
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
