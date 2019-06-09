import React, { Component } from "react";

export default class Public extends Component {
  state = {
    message: ""
  };

  componentDidMount() {
    fetch("/public")
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network failed" + response);
      })
      .then(response => {
        this.setState({ message: response.message });
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  render() {
    return (
      <div>
        <p> {this.state.message}</p>
      </div>
    );
  }
}
