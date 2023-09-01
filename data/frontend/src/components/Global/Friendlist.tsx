import { Box, Grid, Button, Typography } from "@mui/material";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import AdjustIcon from '@mui/icons-material/Adjust';

function Friendlist() {
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
				<Box sx={{backgroundColor:'#FE8F29', marginTop:'0.5em', borderRadius:'0.5em', padding:'0.1em', paddingX: '0.4em',}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
							  >
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "2.5em", width: "2.5em", borderRadius:'3em', marginLeft:'0.3em' }}
							>
							</Box>
          	  		  	</Grid>

						<Grid item marginLeft='-0.3em'>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'1em',
									transform: "translate(0%, 14%)",
            				  	}}
            				>
            				  	Username
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 14,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
									marginRight:'0.9em',
									transform: "translate(0%, -8%)",
            				  	}}
            				>
            				  	<VideogameAssetIcon sx={{fontSize:'16px', transform: "translate(0%, 16%)",}} /> In game
            				</Typography>
          	  		  	</Grid>

						<Grid item marginLeft='-1.2em'>
          	  		  	  	<Button sx={{backgroundColor:'#D9D9D9', border:'black solid', borderRadius:'1em', borderWidth:'2px', fontSize:'10px', width:'4em', height:'2.5em', minWidth: '0.2em', paddingX: '24px',}}>Watch</Button>
          	  		  	</Grid>
						<Grid item marginLeft='-0.2em'>
          	  		  	  	<Button sx={{backgroundColor:'#D9D9D9', border:'black solid', borderRadius:'1em', borderWidth:'2px', fontSize:'10px', width:'4em', height:'2.5em', minWidth: '5px', paddingX: '24px',}}>Delete</Button>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>

			<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%" }}
			>
				<Box sx={{backgroundColor:'#1ABAFF', marginTop:'0.5em', borderRadius:'0.5em', padding:'0.1em', paddingX: '0.4em',}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
							  >
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "2.5em", width: "2.5em", borderRadius:'3em', marginLeft:'0.3em' }}
							>
							</Box>
          	  		  	</Grid>

						<Grid item marginLeft='-0.3em'>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'1em',
									transform: "translate(0%, 14%)",
            				  	}}
            				>
            				  	Username
            				</Typography>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 14,
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginTop:'auto',
									marginRight:'1.4em',
									transform: "translate(0%, -8%)",
            				  	}}
            				>
            				  	<AdjustIcon sx={{fontSize:'16px', transform: "translate(0%, 16%)",}} /> Online
            				</Typography>
          	  		  	</Grid>

						<Grid item marginLeft='-1.2em'>
          	  		  	  	<Button sx={{backgroundColor:'#D9D9D9', border:'black solid', borderRadius:'1em', borderWidth:'2px', fontSize:'10px', width:'4em', height:'2.5em', minWidth: '0.2em', paddingX: '24px',}}>Play</Button>
          	  		  	</Grid>
						<Grid item marginLeft='-0.2em'>
          	  		  	  	<Button sx={{backgroundColor:'#D9D9D9', border:'black solid', borderRadius:'1em', borderWidth:'2px', fontSize:'10px', width:'4em', height:'2.5em', minWidth: '5px', paddingX: '24px',}}>Delete</Button>
          	  		  	</Grid>
          	  		</Grid>
				</Box>
          	</Grid>


			<Grid
          	  	item
          	  	xs
          	  	sx={{ backgroundColor: "", width: "100%", height: "90%" }}
			>
				<Box sx={{backgroundColor:'#919191', marginTop:'0.5em', borderRadius:'0.5em', padding:'0.4em', paddingX: '0.4em',}}>
          	  		<Grid
          	  		  	container
          	  		  	spacing={1}
          	  		  	justifyContent="flex-start"
          	  		  	alignItems="center"
							  >
          	  		  	<Grid item>
          	  		  	  	<Box
          	  		  	  	  	sx={{ backgroundColor: "#D9D9D9", border:'black solid', borderWidth:'2px', height: "2.5em", width: "2.5em", borderRadius:'3em', marginLeft:'0.3em' }}
							>
							</Box>
          	  		  	</Grid>

						<Grid item marginLeft='-0.3em'>
							<Typography
            				  	variant="h6"
            				  	sx={{
            				  	  	fontSize: 16,
            				  	  	fontWeight: "bold",
            				  	  	color: "black",
            				  	  	marginLeft: "auto",
									marginRight:'1em',
									transform: "translate(0%, 5%)",
            				  	}}
            				>
            				  	Username
            				</Typography>
          	  		  	</Grid>

						<Grid item marginLeft='-1.2em'>
          	  		  	  	<Button sx={{backgroundColor:'#D9D9D9', border:'black solid', borderRadius:'1em', borderWidth:'2px', fontSize:'10px', width:'4em', height:'2.5em', minWidth: '0.2em', paddingX: '24px',}}>Play</Button>
          	  		  	</Grid>
						<Grid item marginLeft='-0.2em'>
          	  		  	  	<Button sx={{backgroundColor:'#D9D9D9', border:'black solid', borderRadius:'1em', borderWidth:'2px', fontSize:'10px', width:'4em', height:'2.5em', minWidth: '5px', paddingX: '24px',}}>Delete</Button>
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

export default Friendlist;
