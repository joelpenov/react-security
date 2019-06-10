import React, { Component } from "react";
import "./spinner.css";
import AuthContext from "../AuthContext";

export default class Auth0CallbackComponent extends Component {
  static contextType = AuthContext;
  componentDidMount = () => {
    const auth0 = this.context;
    const validUriParamsRe = /error|token_type|state|token_type|id_token/;
    if (validUriParamsRe.test(this.props.location.hash)) {
      auth0.handleAuthorization();
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
