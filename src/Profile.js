import React, { Component } from "react";

class Profile extends Component {
  state = {
    error: "",
    profile: null
  };

  componentDidMount() {
    this.getUserProfile();
  }

  getUserProfile = () => {
    this.props.auth0.getUserProfile(profile => {
      this.setState({ profile: profile });
    });
  };

  render() {
    if (!this.state.profile) return null;
    const { profile } = this.state;
    return (
      <>
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
      </>
    );
  }
}

export default Profile;
