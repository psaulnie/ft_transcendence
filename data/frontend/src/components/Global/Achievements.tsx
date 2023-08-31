import UploadButton from "./UploadButton";
import React, { useEffect, useState } from "react";

import falonsoImage from "./falonso.jpg";

import { Box, Grid, Button, Avatar, Typography, Paper } from "@mui/material";

function Achievements() {
  return (
    <div>
      {/* <UploadButton /> */}
      <Box
        sx={{
          position: "fixed",
          transform: "translate(5%, 0%)",
          top: "11.5%",
          width: "90%",
          height: "80.5%",
          padding: "0.9em",
          borderRadius: "3em",
          background: "linear-gradient(to right, #ECECEC, #d6d4d4)",
          border: "2px solid #000000",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Grid
          container
          spacing={0}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          	<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%" }}
			>
				<Box sx={{backgroundColor:'#919191', marginTop:'0.5em', borderRadius:'0.5em', padding:'0.4em'}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
							  >
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "3em", width: "3em", borderRadius:'0.4em', marginLeft:'0.3em' }}
							>
								<Box
          	  		  	  	  		sx={{ backgroundColor: "#FE8F29", marginTop:'0.4em', marginLeft:'0.4em', border:'black solid', borderWidth:'2px', height: "2em", width: "2em", borderRadius:'0.4em'}}
								></Box>
							</Box>
          	  		  	</Grid>
						<Grid item>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 20,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'2.5em',
            				  	}}
            				>
            				  	Victorious:
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
            				  	}}
            				>
            				  	Win your first game !
            				</Typography>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>

			<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%", marginTop:"-0.5em"}}
			>
				<Box sx={{backgroundColor:'#919191', marginTop:'1em', borderRadius:'0.5em', padding:'0.4em'}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
					>
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "3em", width: "3em", borderRadius:'0.4em', marginLeft:'0.3em'}}
							></Box>
          	  		  	</Grid>
						<Grid item>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 20,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'2.3em',
            				  	}}
            				>
            				  	Winner:
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
            				  	}}
            				>
            				  	Win 10 games !
            				</Typography>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>

			<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%", marginTop:"-0.5em"}}
			>
				<Box sx={{backgroundColor:'#919191', marginTop:'1em', borderRadius:'0.5em', padding:'0.4em'}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
					>
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "3em", width: "3em", borderRadius:'0.4em', marginLeft:'0.3em'}}
							></Box>
          	  		  	</Grid>
						<Grid item>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 20,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'2.3em',
            				  	}}
            				>
            				  	Sociable:
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
									marginRight:'2.2em',
            				  	}}
            				>
            				  	Add a friend !
            				</Typography>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>

			<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%", marginTop:"-0.5em"}}
			>
				<Box sx={{backgroundColor:'#919191', marginTop:'1em', borderRadius:'0.5em', padding:'0.4em'}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
					>
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "3em", width: "3em", borderRadius:'0.4em', marginLeft:'0.3em'}}
							></Box>
          	  		  	</Grid>
						<Grid item>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 20,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'4.2em',
            				  	}}
            				>
            				  	Addict:
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
									marginRight:'2.2em',
            				  	}}
            				>
            				  	Play 50 games !
            				</Typography>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>

			<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%", marginTop:"-0.5em"}}
			>
				<Box sx={{backgroundColor:'#919191', marginTop:'1em', borderRadius:'0.5em', padding:'0.4em'}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
					>
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "3em", width: "3em", borderRadius:'0.4em', marginLeft:'0.3em'}}
							></Box>
          	  		  	</Grid>
						<Grid item>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 20,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'3.2em',
            				  	}}
            				>
            				  	Designer:
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
            				  	}}
            				>
            				  	Change background !
            				</Typography>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>








          	<Grid
          	  	item
          	  	xs
          	  	sx={{ width: "100%", height: "100%", marginTop: "0.25em" }}
          	>
          	  	<Button
          	  	  	variant="contained"
          	  	  	color="primary"
          	  	  	sx={{
          	  	  	  	textTransform: "none",
          	  	  	  	fontWeight: "bold",
          	  	  	  	fontSize: "18px",
          	  	  	  	width: "6em",
          	  	  	  	height: "1.5em",
          	  	  	  	backgroundColor: "rgba(220, 220, 220, 0.9)",
          	  	  	  	border: "2px solid #020202",
          	  	  	  	borderRadius: "1em",
						marginTop:'0.3em',
          	  	  	  	color: "black",
          	  	  	  	"&:hover": {
          	  	  	  	  backgroundColor: "grey",
          	  	  	  	  borderColor: "red",
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
