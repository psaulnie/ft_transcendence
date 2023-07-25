import {SyntheticEvent, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [apiToken, setApiToken] = useState('');

    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    useEffect(() => {
        console.log('code',code);
    }, [code]);

    const signInRequestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    };

    const profileRequestOptions = {
        headers: { 'Authorization': `Bearer ${apiToken}` }
    };

    const apiGet = () => {
        fetch("http://localhost:5000/auth/login", signInRequestOptions)
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                setApiToken(json.access_token);
            });
    };

    // const apiSignIn = () => {
    async function apiSignIn() {
        try {
            await fetch("http://localhost:5000/auth/signIn", signInRequestOptions)
                .then(response => response.json())
                .then((json) => {
                    if (json.statusCode) {
                        throw new Error('bad password');
                    }
                    console.log("apiSignIn(): successfully logged");
                    console.log('JSON ', json);
                    console.log(json.user);
                });
        }
        catch (e) {
            console.log('Error from apiSignIn(): ', e);
        }
    }

    const apiGetProfile = () => {
        console.log(profileRequestOptions)
        fetch("http://localhost:5000/profile", profileRequestOptions)
            .then((json) => {
                console.log(json);
            });
    };

    async function apiIntraLogIn() {
        try {
            await fetch("http://localhost:5000/auth/intra", signInRequestOptions)
                .then(response => response.json())
                .then((json) => {
                    if (json.statusCode) {
                        throw new Error('Connection error');
                    }
                    console.log("apiIntraLogIn(): successfully logged");
                    console.log('JSON ', json);
                    // console.log(json.user);
                });
        }
        catch (e) {
            console.log('Error from apiIntraLogIn(): ', e);
        }
    }

    function onUsernameChange(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        setUsername(e.currentTarget.value);
    }

    function onPasswordChange(e: React.FormEvent<HTMLInputElement>) {
        e.preventDefault();
        setPassword(e.currentTarget.value);
    }

    function signIn(e: SyntheticEvent) {
        e.preventDefault();
        apiSignIn();
    }

    function logIn(e: SyntheticEvent) {
        e.preventDefault();
        apiGet();
        // apiGetProfile();
    }

    // function intraLogIn(e: SyntheticEvent) {
    // 	e.preventDefault();
    // 	apiIntraLogIn();
    // }

    function openWindowIntra() {
        let client_id = 'u-s4t2ud-5f76e5703881a3508a6f0331e11285c76147304f743e47455af0330b347363fe';
        let redirect_uri = 'http://localhost:3000/login';
        const url  = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
        console.log(url);
        window.location.href = url;
    }

    return (
        <div className='main'>
            <p>Coucou from Login</p>
            <form>
                <input value={username} onChange={onUsernameChange} />
                <input value={password} onChange={onPasswordChange} />
                <button onClick={signIn}>SignIn</button>
                <button onClick={logIn}>LogIn</button>
                <button><a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5f76e5703881a3508a6f0331e11285c76147304f743e47455af0330b347363fe&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code
">Intra 42</a></button>

            </form>
        </div>
    )
}

export default Login;
