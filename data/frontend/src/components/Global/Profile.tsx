import { Box, Grid, Button, Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetUserProfileQuery } from "../../store/api";
import Loading from "./Loading";
import ErrorSnackbar from "./ErrorSnackbar";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {grey} from "@mui/material/colors";

function Profile() {
  const { username } = useParams();
  useSelector((state: any) => state.user);
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

  const sameButtonStyle = {
    textTransform: 'none',
    fontSize: '18px',
    width: '10em',
    height: '1.5em',
    position: 'fixed',
    transform: 'translate(-50%, 0%)',
    backgroundColor: '#d6d4d4',
    border: '1px solid #000000',
    borderRadius: '1em',
    color: 'black',
    '&:hover': {
      backgroundColor: 'grey',
    }
  };

  const editButtonStyle = {
    backgroundColor: '#d6d4d4',
    borderRadius: '5em',
    '&:hover': {
      backgroundColor: '#d6d4d4',
    },
    transform: 'translate(-2%, 25%)',
  };

  return (
    <div>
      <Box sx={{ position: 'fixed', transform: 'translate(5%, 0%)', top: '12%', width: '90%', height: '60%', padding: '1em', borderRadius: '3em', background: '#d6d4d4', border: '1px solid #000000', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)' }}>
        <Grid container direction="column" sx={{ height: '100%' }}>
          <Grid item sx={{ width: '100%', height: '35%', marginTop: '1em', marginLeft: '1.5em' }}>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item justifyContent='center'>
                <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '8em', height: '8em' }} />
              </Grid>
              <Grid item container xs direction="column">
                <Grid item container>
                  <Grid item>
                    <Typography variant="h6" align="left" sx={{ fontSize: 30, fontWeight: 'bold', color: 'black' }}>{userProfile.username.charAt(0).toUpperCase() + userProfile.username.slice(1)}</Typography>
                  </Grid>
                  <Grid>
                    <Button onClick={handleModificationClick} sx={{ ...editButtonStyle }} startIcon={<BorderColorIcon sx={{ color: grey[500] }} />}></Button>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="h6" align="left" sx={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginBottom: '-0.2em' }}>Rank: {userProfile.rank}</Typography>
                  <Typography variant="h6" align="left" sx={{ fontSize: 16, color: 'black', marginBottom: '-0.2em' }}>Wins: {userProfile.wins}</Typography>
                  <Typography variant="h6" align="left" sx={{ fontSize: 16, color: 'black' }}>Losses: {userProfile.loses}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item sx={{ width: '100%', height: '10%' }}>
            <Typography variant="h6" sx={{ fontSize: 24, color: 'black' }}>Match history</Typography>
          </Grid>

          <Grid item xs sx={{ width: '100%', height: '100%' }}>
            {/* ... (Keep your matches list code here) */}
            <Box sx={{ overflow: 'auto', padding: '0.3em', display: 'grid' }}>

              {/* Exemple d'un match : */}
              <Box sx={{ backgroundColor: '#454545', color: 'black', height: '2em', marginBottom: '0.5em' }}>
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                  <Grid item container xs={6} justifyContent="space-evenly" alignItems="center">
                    <Grid item>
                      <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '30px', height: '30px' }} />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: '#1ABAFF', fontSize: 20 }}>4</Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 20, color: 'black' }}>:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 20, color: '#FC7D07' }}>2</Typography>
                    </Grid>
                    <Grid item>
                      <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '30px', height: '30px' }} />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ backgroundColor: '#454545', color: 'black', height: '2em', marginBottom: '0.5em' }}>
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                  <Grid item container xs={6} justifyContent="space-evenly" alignItems="center">
                    <Grid item>
                      <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '30px', height: '30px' }} />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: '#1ABAFF', fontSize: 20 }}>4</Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 20, color: 'black' }}>:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 20, color: '#FC7D07' }}>2</Typography>
                    </Grid>
                    <Grid item>
                      <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '30px', height: '30px' }} />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ backgroundColor: '#454545', color: 'black', height: '2em', marginBottom: '0.5em' }}>
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100%' }}>
                  <Grid item container xs={6} justifyContent="space-evenly" alignItems="center">
                    <Grid item>
                      <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '30px', height: '30px' }} />
                    </Grid>
                    <Grid item>
                      <Typography sx={{ color: '#1ABAFF', fontSize: 20 }}>4</Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 20, color: 'black' }}>:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ fontSize: 20, color: '#FC7D07' }}>2</Typography>
                    </Grid>
                    <Grid item>
                      <Avatar src={urlAvatar} alt="User Avatar" sx={{ width: '30px', height: '30px' }} />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              {/* Ajoutez d'autres matchs de manière similaire ici... */}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Button variant="contained" onClick={handleAchievementsClick} sx={{ ...sameButtonStyle, top: '73%' }}>
        Achievements
      </Button>
      <Button variant="contained" onClick={handleFriendsClick} sx={{ ...sameButtonStyle, top: '76.5%' }}>
        Friends
      </Button>
    </div>
  );
}

export default Profile;
