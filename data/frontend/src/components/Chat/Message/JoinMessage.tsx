import { chatResponseArgs } from "../args.interface";

export default function JoinMessage({
  message,
}: {
  message: chatResponseArgs;
}) {
  return <p>=&#62; {message.source} joined the room</p>;
}
