import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export default function PrivateRoute() {

	const [data, setData] = useState({expires_in_seconds: 0});
	const [isLoading, setIsLoading] = useState(true);

	const fetchData = () => {
		fetch("https://api.intra.42.fr/oauth/token/info", {
			headers: {
				'Authorization': 'Bearer ' + Cookies.get('accessToken'),
			}
		})
		  .then(response => {
			return response.json()
		  })
		  .then(retrievedData => {
			console.log(retrievedData);
			setData(retrievedData);
			setIsLoading(false);
		  })	
	}

	useEffect(() => {
		fetchData();
	}, []);
	if (isLoading)
		return (<div>Loading...</div>);
	if (data && 'expires_in_seconds' in data && data.expires_in_seconds > 0)
	{
		return (<Outlet />);
	}
	return (<Navigate to="/" />)
}