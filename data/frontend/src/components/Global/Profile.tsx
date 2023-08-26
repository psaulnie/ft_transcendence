import UploadButton from "./UploadButton";
import React, { useEffect, useState } from 'react';

import falonsoImage from './falonso.jpg';

import { Box, Grid, Button, Avatar, Typography, } from '@mui/material';

interface ProfileProps {
	toggleProfil: () => void;
}

function Profile({ toggleProfil } : ProfileProps) {

	const handleButtonClick = () => {
		toggleProfil();
	  };

	return (
		<div>
			<h1>Profile</h1>
			{/* <UploadButton /> */}
			<Button
          	  	variant="contained"
          	  	color="primary"
				onClick={handleButtonClick}
          	  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '36px', width: '4em',
        			height: '1.4em',
        			backgroundColor: 'rgba(220, 220, 220, 0.9)',
        			borderColor: 'red',
        			color: 'black',
        			'&:hover': {
        				backgroundColor: 'grey',
        				borderColor: 'red',
        			},
        		}}
          	>
          	  	Back
          	</Button>
			<Box
    		  	sx={{
					position: 'fixed',
        			transform: 'translate(5%, 0%)',
					top: '12%',
        			width: '90%',
        			height: '60%',
					padding: '2em',
					borderRadius: '3em',
					background: 'linear-gradient(to right, #ECECEC, #d6d4d4)',
        			border: '2px solid #000000',
					boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    		  	}}
    		>	
				<Grid container spacing={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 'auto'}}>
    			  	<Grid item xs={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    			  	  	<Avatar src={falonsoImage} alt="User Avatar" sx={{ width: '4em', height: 'auto', marginLeft: '2em', }}/>
    			  	</Grid>
    			  	<Grid item xs={7}>
    			  	  	<Box>
    			  	  	  	<Typography variant="h6" sx={{ fontSize: 28, fontWeight: 'bold', color: 'black', marginLeft: '1em',}}>Falonso</Typography>
    			  	  	  	<Typography variant="body2" sx={{ fontSize: 28, fontWeight: 'bold', color: 'black', marginLeft: '1em',}}>Status: Auth</Typography>
    			  	  	</Box>
    			  	</Grid>
    			  	<Grid item xs={4}>
    			  	  	<Typography variant="body1">33</Typography>
    			  	</Grid>
    			  	<Grid item xs={4}>
    			  	  	<Typography variant="body1">44</Typography>
    			  	</Grid>
    			  	<Grid item xs={4}>
    			  	  	<Typography variant="body1">55</Typography>
    			  	</Grid>
    			  	<Grid item xs={4}>
    			  	  	<Typography variant="body1">66</Typography>
    			  	</Grid>
    			  	<Grid item xs={4}>
    			  	  	<Typography variant="body1">77</Typography>
    			  	</Grid>
    			  	<Grid item xs={4}>
    			  	  	<Typography variant="body1">88</Typography>
    			  	</Grid>
    			</Grid>
			</Box>
		</div>
	)
};

export default Profile;