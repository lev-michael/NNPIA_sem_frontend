import './App.css';
import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { useAuth } from "./component/AuthContext";
import Menu from "./component/menu/Menu";
import Home from "./component/home/Home";
import LoginForm from "./component/login/LoginForm";
import MovieDetail from './component/movie/movie-detail/MovieDetail';
import MovieList from './component/movie/movie-list/MovieList';

function App() {

  const { user, userDetail } = useAuth()

  console.log(userDetail);

  const loggedNav = user && [
    {
      id: 1,
      title: "Home",
      to: "/",
    },
    {
      id: 2,
      title: "Movies",
      to: "/movies",
    },
    {
      id: 3,
      title: "Actors",
      to: "/actors",
    },
    {
      id: 4,
      title: "Profile",
      to: "/profile",
    },
    {
      id: 5,
      title: "Logout",
      to: "/logout",
    }
  ]

  const notLoggedNav = [
    {
      id: 1,
      title: "Home",
      to: "/",
    },
    {
      id: 2,
      title: "Movies",
      to: "/movies",
    },
    {
      id: 3,
      title: "Sing in",
      to: "/login",
    },
  ]


  return <Router>
    <div>
      <nav>
        <Menu nav={user ? loggedNav : notLoggedNav}></Menu>
      </nav>
      <div className='main'>
        <Switch>
          <Route exact={true} path="/movies/:id">
            <MovieDetail/>
          </Route>
          <Route exact={true} path="/movies">
            <MovieList/>
          </Route>
          <Route exact={true} path="/profile">
            <Home />
          </Route>
          <Route exact={true} path="/Logout">
            <Logout />
          </Route>
          <Route exact={true} path="/Login">
            <LoginForm />
          </Route>
          <Route exact={true} path="/">
            <Home></Home>
          </Route>
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </div>
  </Router>
}

function Logout() {
  const { removeTokens } = useAuth()
  removeTokens()
  return <Redirect to="/" />;
}


export default App;
