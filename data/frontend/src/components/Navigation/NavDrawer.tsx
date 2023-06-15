import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { Typography } from '@mui/material';

import NavDrawerButton from './NavDrawerButton';

export default function NavDrawer({state, toggleDrawer}: {state: boolean, toggleDrawer: any}) {

  return (
          <Drawer
			anchor="left"
            open={state}
            onClose={toggleDrawer(false)}
          >
			<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer(false)}
			onKeyDown={toggleDrawer(false)}
			>
				<Typography variant="h5">ft_transcendence</Typography>
				<List>
						<NavDrawerButton buttonText='Game'/>
						<NavDrawerButton buttonText='Chat'/>
						<NavDrawerButton buttonText='Profile'/>
				</List>
			</Box>	
          </Drawer>
  );
};