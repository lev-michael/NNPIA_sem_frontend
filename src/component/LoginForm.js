import { Redirect } from "react-router-dom";
import { useAuth } from "./AuthContext";
import React, { useState } from 'react';

export default function LoginForm() {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});
  const { setTokens } = useAuth();

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    data[name] = value
    setData({ ...data })
  }

  function postLogin(e) {
    e.preventDefault()

    fetch(`${process.env.REACT_APP_BASE_URI}/authenticate`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error(`Unable to get data: ${response.statusText}`)
      })
      .then(json => {
        setTokens(json.token);
        setLoggedIn(true);
      })
      .catch((err) => {
        setIsError(err.message)
      })

  }

  if (isLoggedIn) {
    return <Redirect to="/"/>;
  }

  return (
    <div>
      <form onSubmit={postLogin}>
        <input type={"text"} name={"username"} onChange={handleInputChange}/>
        <input type={"password"} name={"password"} onChange={handleInputChange}/>
        <button>Login</button>
        {isError}
      </form>

      <div>
        Two users are available
        <ul>
          <li>javainuse - password</li>
          <li>javainuseWithRole - password</li>
        </ul>
      </div>
    </div>

  )

}