import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    const { isAuthenticated } = this.props.auth0;
    return (
      <>
        <h1>Home</h1>
        {isAuthenticated() && (
          <>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </>
    );
  }
}

export default Home;
