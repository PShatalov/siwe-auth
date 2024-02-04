import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import "./App.css";
import { EthereumAuth } from "./EthereumAuth";
import Profile from "./Profile";

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/"
          exact
          render={() =>
            localStorage.getItem("user") ?<Redirect to="/profile" /> : <EthereumAuth />
          }
        />
        <Route
          path="/profile"
          render={() =>
            localStorage.getItem("user") ? <Profile /> : <Redirect to="/" />
          }
        />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
