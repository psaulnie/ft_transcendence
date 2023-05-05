import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [users, setUsers] = useState('')

  const fetchUserData = () => {
    fetch("http://192.168.1.12:5000/users?name=pierrotswag")
      .then(response => {
        return response.text()
      })
      .then(data => {
        setUsers(data)
      })
  }

  useEffect(() => {
    fetchUserData()
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>{users}</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
