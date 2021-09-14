import React, { useEffect } from "react";
import './App.css';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import SpatialNavigation from "spatial-navigation-js";

import Home from './pages/Home';
import Film from './pages/Film';
import Player from "./pages/Player";
import {keyDict, keyPressHandler} from "./constants";


function App() {

  useEffect(() => {
    SpatialNavigation.init();
    SpatialNavigation.add({
      selector: 'a, input, button'
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
  }, []);
  return (
    <Router>
      <Switch>
        <Route path="/film/:href">
          <Film />
        </Route>
        <Route path="/player">
          <Player />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
