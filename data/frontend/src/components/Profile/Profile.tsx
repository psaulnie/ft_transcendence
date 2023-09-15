import { Box, Grid, Button, Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "../../store/api";
import Loading from "../Global/Loading";
import ErrorSnackbar from "../Global/ErrorSnackbar";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {grey} from "@mui/material/colors";

function Profile() {
  const { username } = useParams();
  const user = useSelector((state: any) => state.user);
  const urlAvatar = `http://${import.meta.env.VITE_IP}:5000/api/avatar/${username}`;

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

  const buttonStyle = {
    textTransform: 'none',
    fontSize: '18px',
    width: '10em',
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

  const editButtonStyle = {
    backgroundColor: '#00000000',
    '&:hover': {
      backgroundColor: '#00000000',
    },
    transform: 'translate(-10%, 25%)',
  };

  return (
    <div>
      <Box sx={{ overflowX: 'hidden', overflowY: 'auto', position: 'absolute', left: '50%', top: '12%', transform: 'translate(-50%, 0%)', width: '92.5%', height: '70%', borderRadius: '3em', background: '#d6d4d450', backdropFilter: 'blur(8px)', border: '1px solid #00000088', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}>
        <Grid alignItems='center' sx={{ width: '100%', height: '100%' }}>

          <Grid item sx={{ width: '100%', height: '35%', marginTop: '1em', marginLeft: '1em', marginRight: '-1em' }}>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item justifyContent='center'>
                <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '8em', height: '8em' }} />
              </Grid>
              <Grid item container xs direction="column">
                <Grid item container>
                  <Grid item>
                    <Typography variant="h6" align="left" sx={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>{userProfile.username.charAt(0).toUpperCase() + userProfile.username.slice(1)}</Typography>
                  </Grid>
                  {user.username === username && (
                    <Grid>
                      <Button onClick={handleModificationClick} sx={{ ...editButtonStyle }} startIcon={<BorderColorIcon sx={{ color: grey[200] }} />} />
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="h6" align="left" sx={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginBottom: '-0.2em' }}>Rank: {userProfile.rank}</Typography>
                  <Typography variant="h6" align="left" sx={{ fontSize: 16, color: 'black', marginBottom: '-0.2em' }}>Wins: {userProfile.wins}</Typography>
                  <Typography variant="h6" align="left" sx={{ fontSize: 16, color: 'black' }}>Losses: {userProfile.loses}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sx={{ width: '100%', height: '8%' }}>
            <Typography variant="h6" sx={{ fontSize: 24, color: 'black' }}>
              Match history
            </Typography>
          </Grid>

          <Grid item sx={{ width: '100%', height: '52%', overflow: 'auto' }}>
            {userProfile.matchHistory && userProfile.matchHistory.length > 0 ? (
              userProfile.matchHistory.map((match: any, index: any) => (
                <Grid container key={index} alignItems="center" justifyContent="center"
                  sx={{
                    background: 'linear-gradient(90deg, #45454500, #454545AA, #454545FF, #454545AA, #45454500)',
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                    borderWidth: '1px 0',
                    borderStyle: 'solid',
                    borderImage: 'linear-gradient(to right, #00000000, #d6d4d4, #00000000)',
                    borderImageSlice: '1 0',
                    width: '100%',
                    height: '2.5em',
                    marginBottom: '0.5em',
                  }}
                >
                  <Grid item container alignItems="center" justifyContent="center">
                    <Avatar src={`http://${import.meta.env.VITE_IP}:5000/api/avatar/${match.p1}`} alt="User Avatar" sx={{ width: '30px', height: '30px', margin: '0 30px' }} />
                    <Typography sx={{ color: match.scoreP1 > match.scoreP2 ? '#1ABAFF' : '#FC7D07', fontSize: 20, margin: '0 10px' }}>{match.scoreP1}</Typography>
                    <Typography sx={{ fontSize: 20, color: 'black', margin: '0 5px' }}>:</Typography>
                    <Typography sx={{ color: match.scoreP2 > match.scoreP1 ? '#1ABAFF' : '#FC7D07', fontSize: 20, margin: '0 10px' }}>{match.scoreP2}</Typography>
                    <Avatar src={`http://${import.meta.env.VITE_IP}:5000/api/avatar/${match.p2}`} alt="User Avatar" sx={{ width: '30px', height: '30px', margin: '0 30px' }} />
                  </Grid>
                </Grid>
              ))
            ) : (<p>No match history available.</p>)}
          </Grid>

        </Grid>
      </Box>

      {user.username === username && (
        <Button variant="contained" onClick={handleFriendsClick} sx={{ ...buttonStyle, bottom: '14%' }}>
          Friends
        </Button>
      )}

      <Button variant="contained" onClick={handleAchievementsClick} sx={{ ...buttonStyle, bottom: '10%' }}>
        Achievements
      </Button>

    </div>
  );
}

export default Profile;
