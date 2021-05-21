import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import History from "./components/History";
import Calculate from "./components/Calculate"
import NF from "./components/NF"
import "./assets/main.css";
import "react-toastify/dist/ReactToastify.css";


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ToastContainer autoClose={3000} position="bottom-right"/>
          <Switch>
          <Route path="/" exact component={Landing} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          
          <Route path="/history" exact component={History} />
          <Route path="/calculate" exact component={Calculate} />
          <Route component={NF} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
