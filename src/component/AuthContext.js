import { createContext, useContext, useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import { Redirect } from 'react-router-dom';

const getUser = (token) => (token && jwt_decode(token));

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);

  const removeTokens = () => {
    localStorage.removeItem("tokens");
    setLoggedIn(false);
    setState({
      status: 'success',
      error: null,
      user: null,
      userDetail: null,
      token: authTokens,
      setTokens,
      removeTokens
    })
  }

  const [authTokens, setAuthTokens] = useState();

  const [state, setState] = useState({
    status: 'pending'
  })

  const setTokens = (data) => {
    localStorage.setItem("tokens", data);
    setAuthTokens(data);
    setLoggedIn(true);
    const user = getUser(data);
    setState({
      status: 'success',
      error: null,
      user: user,
      userDetail: userDetail,
      token: data,
      setTokens,
      removeTokens
    }
    );

  }
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    const user = getUser(localStorage.getItem("tokens"));
    if (user) {
      if (user.exp * 1000 < Date.now()) {
        removeTokens()
        return <Redirect to="/" />;
      }
      fetch(`${process.env.REACT_APP_BASE_URI}/user/info`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("tokens")}`
          },
          body: JSON.stringify({ username: user.sub })
        })
        .then(res => res.json())
        .then(res => setUserDetail(res.result))
        .catch((error) => setUserDetail(null))
    } else {
      setUserDetail(null);
    }
  }, [loggedIn])

  useEffect(() => {
    const user = getUser(localStorage.getItem("tokens"));
    setState({
      status: 'success',
      error: null,
      user: user,
      userDetail: userDetail,
      token: localStorage.getItem("tokens"),
      setTokens,
      removeTokens
    }
    );
  }, [userDetail])

  return (
    <AuthContext.Provider value={state}>
      {state.status === 'pending' ? (
        'Loading...'
      ) : state.status === 'error' ? (
        <div>
          Oh no
          <div>
            <pre>{state.error.message}</pre>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const state = useContext(AuthContext)
  const isPending = state.status === 'pending'
  const isError = state.status === 'error'
  const isSuccess = state.status === 'success'
  const isAuthenticated = state.user && isSuccess
  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated,
  }
}

export { AuthProvider, useAuth }