import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthContext from "./AuthContext";

class Nav extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {auth0 => (
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/public">Public</Link>
              </li>
              {auth0.isAuthenticated() && (
                <li>
                  <Link to="/private">Private</Link>
                </li>
              )}
              {auth0.isAuthenticated() &&
                auth0.userHasPermission(["read:courses"]) && (
                  <li>
                    <Link to="/courses">Courses</Link>
                  </li>
                )}
              <li>
                <button
                  to="/profile"
                  onClick={auth0.isAuthenticated() ? auth0.logout : auth0.login}
                >
                  {auth0.isAuthenticated() ? "Log Out" : "Log In"}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default Nav;
