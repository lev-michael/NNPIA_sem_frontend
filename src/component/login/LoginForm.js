import { Redirect } from "react-router-dom";
import { useAuth } from "../AuthContext";
import React, { useState } from 'react';
import "../themes/input.scss"
import "../themes/button.scss"
import "./LoginForm.scss"

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
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
      })
      .then(json => {
        setTokens(json.token);
        setLoggedIn(true);
        setIsError(null)
      })
      .catch((err) => {
        setIsError("Wrong username or password")
      })

  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-form">
      <h2>Login to your account</h2>
      <form onSubmit={postLogin}>
        <label htmlFor="username">Username</label>
        <input className="input" type={"text"} name={"username"} onChange={handleInputChange} />
        <label htmlFor="password">Password</label>
        <input className="input" type={"password"} name={"password"} onChange={handleInputChange} />
        <div className="error">{isError}</div>
        <div className="flex flex--justify-end">
          <button className="button button--red margin-element--top">Login</button>
        </div>
      </form>
    </div>

  )

}