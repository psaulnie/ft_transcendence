import Navigation from "../Navigation/Navigation";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setUsername } from "../../store/user";

function Home() {
    const dispatch = useDispatch();
    const cookies = Cookies.get();
    console.log('cookies : ', cookies); // Display cookies

    useEffect(() => {
        const username = Cookies.get('username');
        const accessToken = Cookies.get('accessToken');
        if (!username || !accessToken)
            return; // TODO
        dispatch(setUsername(username));
        dispatch(login(accessToken));
    }, [dispatch]);

    return (
      <p>You are in Home</p>
    );
}

export default Home;
