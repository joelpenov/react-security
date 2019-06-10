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
import SecureComponent from "./SecureRoute";
import AuthContext from "./AuthContext";

class App extends Component {
  constructor(props) {
    super(props);

    this.auth0 = new Auth0Service(props.history);
  }
  render() {
    const auth0 = this.auth0;
    return (
      <AuthContext.Provider value={auth0}>
        <Nav />
        <div className="body">
          <Route path="/" exact render={props => <Home {...props} />} />
          <Route
            path="/callback"
            render={props => {
              return <Auth0CallbackComponent {...props} />;
            }}
          />
          <Route path="/profile" render={props => <Profile {...props} />} />
          <Route path="/public" component={Public} />
          <SecureComponent
            component={Private}
            path="/private"
            {...this.props}
          />
          <SecureComponent
            component={Courses}
            path="/courses"
            scopes={["read:courses"]}
            {...this.props}
          />
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
