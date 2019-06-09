import React, { Component } from "react";
import "./spinner.css";

export default class Auth0CallbackComponent extends Component {
  componentDidMount = () => {
    const validUriParamsRe = /error|token_type|state|token_type|id_token/;
    if (validUriParamsRe.test(this.props.location.hash)) {
      this.props.auth0.handleAuthorization();
    } else {
      throw new Error("Invalid callback URL");
    }
  };

  render() {
    return (
      <div>
        <div className="loader">Loading...</div>
      </div>
    );
  }
}
