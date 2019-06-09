import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    const {
      isAuthenticated: isAuthenticatedFunct,
      login,
      logout,
      userHasPermission
    } = this.props.auth0;
    const isAuthenticated = isAuthenticatedFunct();
    return (
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
          {isAuthenticated && (
            <li>
              <Link to="/private">Private</Link>
            </li>
          )}
          {isAuthenticated && userHasPermission(["read:courses"]) && (
            <li>
              <Link to="/courses">Courses</Link>
            </li>
          )}
          <li>
            <button to="/profile" onClick={isAuthenticated ? logout : login}>
              {isAuthenticated ? "Log Out" : "Log In"}
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
