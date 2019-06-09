import React, { Component } from "react";

export default class Private extends Component {
  state = {
    message: ""
  };

  componentDidMount() {
    const authorizationHeader = {
      Authorization: `Bearer ${this.props.auth0.getAccessToken()}`
    };
    fetch("/private", {
      headers: authorizationHeader
    })
      .then(response => {
        if (response.ok) return response.json();
        console.log(response);
      })
      .then(response => {
        this.setState({ message: response.message });
      })
      .catch(err => {
        throw console.log(err);
      });
  }

  render() {
    return (
      <div>
        <p>{this.state.message}</p>
      </div>
    );
  }
}
