import './App.css';

// Components
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import {BrowserRouter as Router, Route, Routes, useSearchParams} from "react-router-dom";
// import {useEffect} from "react";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Login />} />
					{/*<Route path="/login" element={<Login />} />*/}
					<Route path="/home" element={<Home />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
