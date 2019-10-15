import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Transactions from './Transactions';
import Home from './Home';

import './App.css';

export default class App extends React.Component {

  state = {}

  async componentDidMount() {
    const response = await fetch('http://localhost:3001/users/me');
    const me = await response.json();
    this.setState({me});
  }

  render() {
    return (
      <div>
        {!this.state.me && <i className="fas fa-spinner fa-pulse position-absolute text-primary" style={{top: '50%', left: '50%', fontSize: 30, marginTop: -15, marginLeft: -15}}></i>}
        {this.state.me && <h1 className="text-primary h1 text-center">{this.state.me.name}</h1>}
        <Router>
          <Switch>
            <Route path="/">
              {this.state.me && <Home me={this.state.me}/>}
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

}
