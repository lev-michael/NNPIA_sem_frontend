import './App.css';
import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { useAuth } from "./component/AuthContext";
import Menu from "./component/menu/Menu";
import Home from "./component/home/Home";
import LoginForm from "./component/login/LoginForm";
import MovieDetail from './component/movie/movie-detail/MovieDetail';
import MovieList from './component/movie/movie-list/MovieList';
import ActorList from './component/actor/actor-list/ActorList';
import ActorDetail from './component/actor/actor-detail/ActorDetail';
import Watchlist from './component/watchlist/Watchlist';
import Profile from './component/profile/Profile';

function App() {

  const { user } = useAuth()

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
      title: "Actors",
      to: "/actors",
    }
  ];

  const userNav = user ? [
    {
      id: 1,
      title: "Watchlist",
      to: "/watchlist",
    },
    {
      id: 2,
      title: "Profile",
      to: "/profile",
    },
    {
      id: 3,
      title: "Logout",
      to: "/logout",
    }
  ] 
  : [
    {
      id: 1,
      title: "Login",
      to: "/login",
    },
  ];


  return <Router>
    <div className='main'>
      <nav>
        <Menu nav={user ? loggedNav : notLoggedNav} userNav={userNav}></Menu>
      </nav>
      <div >
        <Switch>
          <Route exact={true} path="/movies/:id">
            <MovieDetail/>
          </Route>
          <Route exact={true} path="/movies">
            <MovieList/>
          </Route>
          <Route exact={true} path="/actors">
            <ActorList/>
          </Route>
          <Route exact={true} path="/actors/:id">
            <ActorDetail/>
          </Route>
          <Route exact={true} path="/watchlist">
            <Watchlist/>
          </Route>
          <Route exact={true} path="/profile">
            <Profile/>
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
