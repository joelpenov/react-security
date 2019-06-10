import React, { Component } from "react";
import AuthContext from "./AuthContext";

class Profile extends Component {
  static contextType = AuthContext;

  state = {
    error: "",
    profile: null
  };

  componentDidMount() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    let auth0 = this.context;

    auth0.getUserProfile(profile => {
      this.setState({ profile: profile });
    });
  };

  render() {
    if (!this.state.profile)
      return <p>Please login to see your profile info</p>;
    const { profile } = this.state;
    return (
      <AuthContext.Consumer>
        {auth0 => {
          return (
            <div>
              <h1>Profile</h1>
              <p>
                <img
                  style={{ width: 50, height: 50 }}
                  src={profile.picture}
                  alt={profile.name}
                />
              </p>
              <p>{profile.name}</p>
              <p>{profile.nickname}</p>
              <pre>{JSON.stringify(profile, null, 2)}</pre>
            </div>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

export default Profile;
