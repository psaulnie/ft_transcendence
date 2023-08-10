import Navigation from "../Navigation/Navigation";
import Cookies from 'js-cookie';

function Home() {
    const cookies = Cookies.get();
    console.log('cookies : ', cookies); // Display cookies
    return (
      <p>You are in Home</p>
    );
}

export default Home;
