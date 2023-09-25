import {Box, Button, Grid} from "@mui/material";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {useGetUserAchievementsQuery} from "../../store/api";
import Completed from "./Completed";
import ToComplete from "./ToComplete";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";

function Achievements() {
  const navigate = useNavigate();
  const {username} = useParams();

  const handleProfileClick = () => {
    navigate("/profile/" + username);
  };

  const {
    data: userAchievements,
    isLoading,
    isError,
  } = useGetUserAchievementsQuery({username});

  if (isLoading) return <Loading/>;
  if (isError) return <ErrorSnackbar error={isError}/>;
  if (userAchievements.exist === false) return <Navigate to="/home"/>;

  const buttonStyle = {
    textTransform: 'none',
    fontSize: '18px',
    width: '5em',
    height: '1.5em',
    position: 'fixed',
    transform: 'translate(-50%, 0%)',
    backgroundColor: '#d6d4d4',
    border: '1px solid #00000088',
    borderRadius: '1em',
    color: 'black',
    '&:hover': {
      backgroundColor: 'grey',
    }
  };

  return (
    <div>
      <Box
        overflow='auto'
        sx={{
          position: "absolute",
          left: '50%',
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "35em",
          height: "30em",
          paddingTop: '1.3em',
          borderRadius: "3em",
          background: "#d6d4d470",
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
        </Grid>
      </Box>

      <Button onClick={handleProfileClick} variant="contained" sx={{...buttonStyle, bottom: '10%'}}>
        Back
      </Button>

    </div>
  );
}

export default Achievements;
