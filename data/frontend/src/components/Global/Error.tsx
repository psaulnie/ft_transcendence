import { Typography } from "@mui/material";
import { Navigate } from "react-router";

export default function Error({ error }: { error: any }) {
  console.log(error);
  if (error.status === 403)
    return (<Navigate to="/login"/>)
  return <Typography variant="h1">Error {error.status}</Typography>;
}
