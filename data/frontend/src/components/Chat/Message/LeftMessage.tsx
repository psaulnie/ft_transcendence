import { chatResponseArgs } from "../args.interface";

export default function LeftMessage({
  message,
}: {
  message: chatResponseArgs;
}) {
  return <p>&#60;= {message.source} left the room</p>;
}
