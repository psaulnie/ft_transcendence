import { Typography, Stack, Grid } from "@mui/material";
import { chatResponseArgs } from "../args.interface";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function JoinMessage({
  message,
}: {
  message: chatResponseArgs;
}) {
  return (
    <Grid   container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center">
      <Stack direction="row" alignItems="center" gap={1}>
        <ArrowRightIcon />
        <Typography>{message.source} joined the room</Typography>
      </Stack>
    </Grid>
  );
}
