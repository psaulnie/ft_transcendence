import React, { useState } from 'react';

import CreateChannel from './CreateChannel';
import JoinChannel from './JoinChannel';
import JoinDirectMessage from './JoinDirectMessage';

import { Box, Grid, Button } from '@mui/material';
import Drawer from "@mui/material/Drawer";
import MenuIcon from '@mui/icons-material/Menu';

function Tab()
{
    const [isTabOpen, setIsTabOpen] = useState(false);
  
    const handleOpenTab = () => {
    	setIsTabOpen(true);
    };
  
    const handleCloseTab = () => {
    	setIsTabOpen(false);
    };
  
    return (
    	<>
			<Button variant="text"
				onClick={handleOpenTab}
				startIcon={<Box sx={{ fontSize: 30, color: "red"}}>
					<MenuIcon sx={{marginLeft: '1.8em', width: 'auto',}}/>
				</Box>}
      			sx={{
				padding: "0.7em",
				'&:hover': {
					backgroundColor: 'rgba(255, 255, 255, 0)',
				},
        		"& .MuiButton-startIcon": {
        			marginRight: "0.25em",
        		},
        		"& .MuiButton-label": {
        		  	display: "flex",
        			alignItems: "center",
        		},
      			}}
			></Button>
		
    		{/* Drawer for the tab */}
    		<Drawer
    			anchor="right"
    			open={isTabOpen}
    			onClose={handleCloseTab}
    		>
    			<Box sx={{ width: "100%", height: "100%", background: "linear-gradient(to bottom left, #f26700, #bf0505)", Padding: '16px'}}>
					<Box sx={{ textAlign: "center", marginTop: "5%", color: "black" }}>
    					<h1 style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "80px"}}>
    						Menu !
    					</h1>
  					</Box>
					<Grid container sx={{ marginLeft: "5%"}}>
						<JoinDirectMessage/>
					</Grid>
					<Grid container sx={{ marginLeft: "5%"}}>
						<CreateChannel/>
					</Grid>
					<Grid container sx={{ marginLeft: "5%"}}>
						<JoinChannel/>
					</Grid>
    			</Box>
    		</Drawer>
    	</>
    );
}

export default Tab;