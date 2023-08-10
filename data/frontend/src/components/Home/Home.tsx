import Navigation from "../Navigation/Navigation";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, setUsername } from "../../store/user";

function Home() {
    const dispatch = useDispatch();
    const cookies = Cookies.get();
    console.log('cookies : ', cookies); // Display cookies

    // useEffect(() => {
    //     const username = Cookies.get('username');
    //     if (!username)
    //         return; // TODO
    //     dispatch(setUsername(username));
    //     dispatch(login())
    // });
    return (
      <p>You are in Home</p>
    );
}

export default Home;
