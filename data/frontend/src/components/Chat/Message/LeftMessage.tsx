import {Grid, Stack, Typography} from "@mui/material";
import {chatResponseArgs} from "../args.interface";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

export default function LeftMessage({ message }: {
  message: chatResponseArgs;
}) {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <ArrowLeftIcon/>
        <Typography>{message.source} left the room</Typography>
      </Stack>
    </Grid>
  );
}
