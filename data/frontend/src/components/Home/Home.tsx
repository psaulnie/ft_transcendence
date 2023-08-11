import React, { useState } from 'react';


import PersonIcon from '@mui/icons-material/Person';

import { Box, Grid, Button, } from '@mui/material';

import Profile from '../Global/Profile';

export default function Home() {
	const [isProfilOpen, setIsProfilOpen] = useState(false);

  	const toggleProfil = () => {
  	  setIsProfilOpen(!isProfilOpen);
  	};

	// const [isGameOpen, setIsGameOpen] = useState(false);

  	// const toggleGame = () => {
  	//   setIsGameOpen(!isGameOpen);
  	// };

	return (
		<div>
		
		{isProfilOpen ? (<Profile toggleProfil={toggleProfil}/>) : (
		/* {isGameOpen ? (<Profile toggleGame={toggleGame}/>) : ( A TROUVER SOLUTION */
		<Box
          	sx={{
          	  	display: 'flex',
          	  	justifyContent: 'center',
          	  	alignItems: 'center',
          	  	height: '50vh',
          	}}
        >	
          	<Grid container direction="column" spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          	  	<Grid item sx={{ marginBottom: '2em' }}>
          	  	  	<Button
          	  	  	  	variant="contained"
          	  	  	  	color="primary"
          	  	  	  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '36px', width: '8em',
        					height: '2em',
        					backgroundColor: 'rgba(255, 255, 255, 0.9)',
        					borderColor: 'red',
        					color: 'black',
        					'&:hover': {
        						backgroundColor: 'red',
        						borderColor: 'red',
        					},
        				}}
          	  	  	>
          	  	  	  	Jouer
          	  	  	</Button>
          	  	</Grid>
          	  	<Grid item>
          	  	  	<Button
						onClick={toggleProfil}
          	  	    	variant="outlined"
          	  	    	color="primary"
        				endIcon={<Box sx={{ fontSize: '40px', color: "black"}}>
        					<PersonIcon style={{
        						fontSize: '36px',
        						verticalAlign: 'middle',
        						color: 'black',
        					}}/>
        				</Box>}
          	  	    	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '36px', width: '6.25em', height: '2em',
        					color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderColor: 'red',
        					'&:hover': {
        						borderColor: 'red',
        					},
        				}}
          	  		>
          	  	    	Profil
          	  	  	</Button>
          	  	</Grid>
          	</Grid>
        </Box>
		)}
		</div>
	)
};