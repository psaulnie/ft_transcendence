import './App.css';

// Components
import Navigation from './components/Navigation/Navigation';
import Chat from './components/Chat/Chat';

function App() {
  return (
    <div className="App"> {/* TODO rename */}
      <Navigation />
      <div className='main'>
        <Chat />
        {/* TODO add Game component*/}
      </div>
    </div>
  );
}

export default App;
