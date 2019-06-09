import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import Nav from "./Nav";
import Auth0Service from "./Auth0/Auth0Service";
import Auth0CallbackComponent from "./Auth0/Auth0Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";

class App extends Component {
  constructor(props) {
    super(props);

    this.auth0 = new Auth0Service(props.history);
  }
  render() {
    return (
      <>
        <Nav auth0={this.auth0} />
        <div className="body">
          <Route
            path="/"
            exact
            render={props => <Home auth0={this.auth0} {...props} />}
          />
          <Route
            path="/callback"
            render={props => {
              return <Auth0CallbackComponent auth0={this.auth0} {...props} />;
            }}
          />
          <Route
            path="/profile"
            render={props => <Profile auth0={this.auth0} {...props} />}
          />
          <Route path="/public" component={Public} />
          <Route
            path="/private"
            render={props =>
              this.auth0.isAuthenticated() ? (
                <Private auth0={this.auth0} {...props} />
              ) : (
                this.auth0.login()
              )
            }
          />
          <Route
            path="/courses"
            render={props => {
              return this.auth0.isAuthenticated() &&
                this.auth0.userHasPermission(["read:courses"]) ? (
                <Courses auth0={this.auth0} {...props} />
              ) : (
                this.auth0.login()
              );
            }}
          />
        </div>
      </>
    );
  }
}

export default App;
