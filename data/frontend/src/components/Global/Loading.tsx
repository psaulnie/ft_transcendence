import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading() {
	return (<Backdrop
		sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
		open={true}
	  >
		Loading...
		<CircularProgress color="inherit" />
	  </Backdrop>)
}