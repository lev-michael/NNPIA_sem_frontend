import './App.css';
import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { useAuth } from "./component/AuthContext";
import Menu from "./component/menu/Menu";
import MovieList from "./component/movie/MovieList";
import Home from "./component/home/Home";
import LoginForm from "./component/LoginForm";


function App() {

  const { user } = useAuth()

  const nav = user && [
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
      title: "Profile",
      to: "/profile",
    },
    {
      id: 4,
      title: "Logout",
      to: "/logout",
    }
  ]


  return <Router>
    <div>
      <nav>
        <Menu nav={nav}></Menu>
      </nav>
      <div className='main'>
        <Switch>
          <Route exact path="/movies">
            <MovieList/>
          </Route>
          <Route exact path="/profile">
            <Home />
          </Route>
          <Route exact path="/Logout">
            <Logout />
          </Route>
          <Route exact path="/Login">
            <LoginForm/>
          </Route>
          <Route exact path="/">
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
