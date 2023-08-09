import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login, setUsername } from "../../store/user";

import { useNavigate } from "react-router-dom";

import { webSocket } from "../../webSocket";

export default function Login() {
	const user = useSelector((state: any) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	function onChange(e: React.ChangeEvent<HTMLInputElement>)
	{
		e.preventDefault();
		dispatch(setUsername(e.currentTarget.value));
	}

	function onSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		if (user.username !== '')
		{
			dispatch(login());
			console.log("login");
			webSocket.emit("newUser", user.username);
			navigate('/home');
		}
	}

	return (
		<form onSubmit={onSubmit}>
			<p>Username:</p>
			<input name="username" value={user.username || ''} onChange={ onChange } />
			<button>Login</button>
		</form>
	);
}