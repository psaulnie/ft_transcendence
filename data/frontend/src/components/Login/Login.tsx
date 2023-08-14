import { SyntheticEvent } from "react";
import { useLocation } from "react-router";

function Login() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const refused = params.get('login-refused');

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
            {refused === 'true' && (
              <div className="alert alert-warning">
                  La connexion avec Intra42 a été refusée. Veuillez réessayer.
              </div>
            )}
        </div>
    )
}

export default Login;
