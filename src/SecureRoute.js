import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import AuthContext from "./AuthContext";

function SecureComponent({ component: Component, scopes, ...rest }) {
  return (
    <AuthContext.Consumer>
      {auth0 => {
        return (
          <Route
            {...rest}
            render={props => {
              if (!auth0.isAuthenticated()) return auth0.login();
              if (scopes.length > 0 && !auth0.userHasPermission(scopes)) {
                return (
                  <p>
                    Unauthorized: The user does not have the corresponding
                    permissions
                  </p>
                );
              }
              return <Component auth0={auth0} {...props} />;
            }}
          />
        );
      }}
    </AuthContext.Consumer>
  );
}

SecureComponent.propTypes = {
  component: PropTypes.func.isRequired,
  scopes: PropTypes.array
};

SecureComponent.defaultProps = {
  scopes: []
};

export default SecureComponent;
