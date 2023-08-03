import {SyntheticEvent } from "react";

function Login() {

    async function apiIntraLogIn() {
        try {
            window.location.href = "http://localhost:5000/auth/login"
        }
        catch (e) {
            console.log('Error from apiIntraLogIn(): ', e);
        }
    }

    function logIn(e: SyntheticEvent) {
        e.preventDefault();
        apiIntraLogIn();
    }

    return (
        <div className='main'>
            <p>Coucou from Login</p>
            <form>
                <button type="button" onClick={logIn}>LogIn</button>
            </form>
        </div>
    )
}

export default Login;
