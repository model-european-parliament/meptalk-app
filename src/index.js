import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker'
import Login from "./Login"
import App from "./App"
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'

let logged = false

export const authorize = () => {
  logged = true
}

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
      logged ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: "/login"
        }} />
      )
    )
  }/>
)

ReactDOM.render(
  <Router>
    <div>
      <PrivateRoute exact path="/" component={App} />
      <Route exact path="/login" component={Login} />
    </div>
  </Router>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
