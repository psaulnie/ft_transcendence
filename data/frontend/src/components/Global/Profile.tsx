import UploadButton from "./UploadButton";
import React, { useEffect, useState } from 'react';

import falonsoImage from './falonso.jpg';

import { Box, Grid, Button, Avatar, Typography, Paper} from '@mui/material';
import { useSelector } from "react-redux";

interface ProfileProps {
	toggleProfil: () => void;
}

function Profile({ toggleProfil } : ProfileProps) {
	const user = useSelector((state: any) => state.user);
	const urlAvatar = "http://localhost:5000/api/avatar/" + user.username;
	const handleButtonClick = () => {
		toggleProfil();
	  };

	return (
		<div>
			<h1>Profile</h1>
			{/* <UploadButton /> */}
			<Box
    		  	sx={{
					position: 'fixed',
        			transform: 'translate(5%, 0%)',
					top: '12%',
        			width: '90%',
        			height: '60%',
					padding: '1em',
					borderRadius: '3em',
					background: 'linear-gradient(to right, #ECECEC, #d6d4d4)',
        			border: '2px solid #000000',
					boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    		  	}}
    		>	
				<Grid container spacing={0} direction="column" justifyContent="center" alignItems="center">
					<Grid item xs sx={{ width:'100%', height:'100%'}}>
						<Grid container spacing={1} justifyContent="center" alignItems="center">
							<Grid item xs={6} sx={{backgroundColor:''}}>
								<Avatar src={urlAvatar} alt="User Avatar" sx={{marginLeft:'0.5em', width: '5em', height: '5em'}}/>
							</Grid>
							<Grid item xs={6} sx={{backgroundColor:'', marginTop:'0.2em'}}>
								<Typography variant="h6" sx={{ fontSize: 30, fontWeight: 'bold', color: 'black',}}>{user.username}</Typography>
								<Typography variant="h6" sx={{ fontSize: 30, fontWeight: 'bold', color: 'black',}}>Rang:🥇</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs sx={{backgroundColor:'', width:'100%', height:'100%'}}>
						<Typography variant="h6" sx={{ fontSize: 28, fontWeight: 'bold', textDecoration: 'underline', color: 'black',}}>STATS</Typography>
					</Grid>
					<Grid item xs sx={{backgroundColor:'', width:'100%', height:'90%', marginTop:'-0.5em'}}>
						<Grid container spacing={1} justifyContent="center" alignItems="center">
							<Grid item xs={6}>
								<Typography variant="h6" sx={{ fontSize: 24, color: 'black',}}>Wins: 4</Typography>
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6" sx={{ fontSize: 24, color: 'black',}}>Loses: 2</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs sx={{backgroundColor:'', width:'100%', height:'100%', marginTop:'-0.4em'}}>
						<Typography variant="h6" sx={{ fontSize: 24, color: 'black'}}>Match history:</Typography>
					</Grid>
					<Grid item xs sx={{backgroundColor:'', width:'100%', height:'30%', marginTop:'-0.4em'}}>
						<Box sx={{overflow: 'auto', height:'6.3em', padding:'0.3em', display: 'grid', gap: '0.5em',}}>
							<Box sx={{backgroundColor:'grey', color:'black'}}>victoire</Box>
							<Box sx={{backgroundColor:'grey', color:'black'}}>defaite</Box>
							<Box sx={{backgroundColor:'grey', color:'black'}}>victoire</Box>
							<Box sx={{backgroundColor:'grey', color:'black'}}>victoire</Box>
							<Box sx={{backgroundColor:'grey', color:'black'}}>victoire</Box>
							<Box sx={{backgroundColor:'grey', color:'black'}}>victoire</Box>
							<Box sx={{backgroundColor:'grey', color:'black'}}>victoire</Box>
						</Box>
					</Grid>
    			</Grid>
			</Box>
			<Button
          	  	variant="contained"
          	  	color="primary"
				onClick={handleButtonClick}
          	  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '20px', width: '10em',
        			height: '1.4em',
					position: 'fixed',
					border: '2px solid #000000',
					transform: 'translate(-50%, 0%)',
        			backgroundColor: 'rgba(220, 220, 220, 0.9)',
					borderRadius: '1em',
					top: '74%',
        			color: 'black',
        			'&:hover': {
        				backgroundColor: 'grey',
        				borderColor: 'red',
        			},
        		}}
          	>
          	  	Achievements
          	</Button>
			  <Button
          	  	variant="contained"
          	  	color="primary"
				onClick={handleButtonClick}
          	  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '20px', width: '10em',
        			height: '1.4em',
					position: 'fixed',
					transform: 'translate(-50%, 0%)',
        			backgroundColor: 'rgba(220, 220, 220, 0.9)',
        			border: '2px solid #000000',
					borderRadius: '1em',
					top: '80.5%',
        			color: 'black',
        			'&:hover': {
        				backgroundColor: 'grey',
        				borderColor: 'red',
        			},
        		}}
          	>
          	  	Friends list
          	</Button>
			  <Button
          	  	variant="contained"
          	  	color="primary"
				onClick={handleButtonClick}
          	  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '20px', width: '10em',
        			height: '1.4em',
					position: 'fixed',
					transform: 'translate(-50%, 0%)',
        			backgroundColor: 'rgba(220, 220, 220, 0.9)',
        			border: '2px solid #000000',
					borderRadius: '1em',
					top: '87%',
        			color: 'black',
        			'&:hover': {
        				backgroundColor: 'grey',
        				borderColor: 'red',
        			},
        		}}
          	>
          	  	Change profil
          	</Button>
		</div>
	)
};

export default Profile;