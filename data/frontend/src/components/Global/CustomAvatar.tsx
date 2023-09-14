import { Avatar } from "@mui/material";

export default function CustomAvatar({ username }: { username: string }) {
  if (username === "") username = "default";
  const url = `http://${import.meta.env.VITE_IP}:5000/api/avatar/` + username;
  return <Avatar src={url} />;
}
