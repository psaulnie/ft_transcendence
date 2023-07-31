import './App.css';

// Components
import Navigation from './components/Navigation/Navigation';
// import Chat from './components/Chat/Chat';
import Game from './components/Game/Game';

function App() {
  return (
    <div className="App"> {/* TODO rename */}
      <Navigation />
      <div className='main'>
        {/* <Chat /> */}
        <Game />
      </div>
    </div>
  );
}

export default App;


// ======================

// import image from "./img/UpmostlyLogo.png"; 

// function Component() {
//   return (
//     <div style={{ backgroundImage:`url(${image})`,backgroundRepeat:"no-repeat" }}>