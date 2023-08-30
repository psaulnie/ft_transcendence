import UploadButton from "./UploadButton";
import React, { useEffect, useState } from 'react';

import falonsoImage from './falonso.jpg';

import { Box, Grid, Button, Avatar, Typography, Paper} from '@mui/material';

function Options() {
	return (
		<div>
			{/* <UploadButton /> */}
			<Box
    		  	sx={{
					position: 'fixed',
        			transform: 'translate(5%, 0%)',
					top: '25%',
        			width: '90%',
        			height: '50%',
					padding: '1em',
					borderRadius: '3em',
					background: 'linear-gradient(to right, #ECECEC, #d6d4d4)',
        			border: '2px solid #000000',
					boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    		  	}}
    		>	
				<Grid container spacing={0} direction="column" justifyContent="center" alignItems="center">
					<Grid item xs sx={{ width:'100%', height:'100%'}}>
						<Typography variant="h6" sx={{ fontSize: 22, fontWeight: 'bold', color: 'black', marginLeft: 'auto'}}>Background:</Typography>
					</Grid>
					<Grid item xs sx={{backgroundColor:'', width:'100%', height:'90%',}}>
						<Grid container spacing={1} justifyContent="center" alignItems="center">
							<Grid item xs={4}>
								<Button sx={{backgroundColor: 'red', height:'4em', width:'4em'}}></Button>
							</Grid>
							<Grid item xs={4}>
								<Button sx={{backgroundColor: 'red', height:'4em', width:'4em'}}></Button>
							</Grid>
							<Grid item xs={4}>
								<Button sx={{backgroundColor: 'red', height:'4em', width:'4em'}}></Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs sx={{backgroundColor:'', width:'100%', height:'90%', marginTop:'0.5em'}}>
						<Grid container spacing={1} justifyContent="center" alignItems="center">
							<Grid item xs={4}>
								<Button sx={{backgroundColor: 'red', height:'4em', width:'4em'}}></Button>
							</Grid>
							<Grid item xs={4}>
								<Button sx={{backgroundColor: 'red', height:'4em', width:'4em'}}></Button>
							</Grid>
							<Grid item xs={4}>
								<Button sx={{backgroundColor: 'red', height:'4em', width:'4em'}}></Button>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs sx={{ width:'100%', height:'100%'}}>
						<Typography variant="h6" sx={{ fontSize: 22, fontWeight: 'bold', color: 'black', marginLeft: 'auto'}}>2FA:</Typography>
					</Grid>
					<Grid item xs sx={{ width:'100%', height:'100%', marginTop:'-0.3em'}}>
						<Button
          				  	variant="contained"
          				  	color="primary"
          				  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '18px', width: '14em',
        						height: '1.4em',
        						backgroundColor: 'rgba(220, 220, 220, 0.9)',
        						border: '2px solid #000000',
								borderRadius: '1em',
        						color: 'black',
        						'&:hover': {
        							backgroundColor: 'grey',
        							borderColor: 'red',
        						},
        					}}
          				>
          				  	S'inscrire avec Google
          				</Button>
					</Grid>
					<Grid item xs sx={{ width:'100%', height:'100%', marginTop:'0.4em'}}>
						<Button
          				  	variant="contained"
          				  	color="primary"
          				  	sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '20px', width: '10em',
        						height: '1.5em',
        						backgroundColor: 'rgba(220, 220, 220, 0.9)',
        						border: '2px solid #020202',
								borderRadius: '1em',
        						color: 'black',
        						'&:hover': {
        							backgroundColor: 'grey',
        							borderColor: 'red',
        						},
        					}}
          				>
          				  	Save changes
          				</Button>
					</Grid>
    			</Grid>
			</Box>
		</div>
	)
};

export default Options;