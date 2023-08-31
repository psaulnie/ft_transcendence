import { Typography } from "@mui/material";

export default function Error({ error }: { error: any }) {
  return <Typography variant="h1">Error {error.status}</Typography>;
}
