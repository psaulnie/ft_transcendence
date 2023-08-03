import {SyntheticEvent, useEffect } from "react";
// import {useSearchParams} from "react-router-dom";

function Login() {
    // const [searchParams] = useSearchParams();
    // const code = searchParams.get('code');
    //
    // useEffect(() => {
    //     console.log('code',code);
    // }, [code]);

    // const signInRequestOptions = {
    //     method: 'GET',
    //     mode: 'cors',
    //     headers: { 'Content-Type': 'application/json' },
    // };

    async function apiIntraLogIn() {
        try {
            await fetch("http://localhost:5000/auth/login", {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => console.log(response))
                .then((json) => {
                    // console.log(json.statusCode);
                    // if (json.statusCode !== 200) {
                    //     throw new Error('Connection error');
                    // }
                    console.log("apiIntraLogIn(): successfully logged");
                    console.log('JSON ', json);
                    // console.log(json.user);
                });
        }
        catch (e) {
            console.log('Error from apiIntraLogIn(): ', e);
        }
    }

    function logIn(e: SyntheticEvent) {
        e.preventDefault();
        apiIntraLogIn();
    }

    // function openWindowIntra() {
    //     let client_id = 'u-s4t2ud-5f76e5703881a3508a6f0331e11285c76147304f743e47455af0330b347363fe';
    //     let redirect_uri = 'http://localhost:3000/login';
    //     const url  = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
    //     console.log(url);
    //     window.location.href = url;
    // }

    return (
        <div className='main'>
            <p>Coucou from Login</p>
            <form>
                <button type="button" onClick={logIn}>LogIn</button>
{/*                <button><a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5f76e5703881a3508a6f0331e11285c76147304f743e47455af0330b347363fe&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code*/}
{/*">Intra 42</a></button>*/}

            </form>
        </div>
    )
}

export default Login;
