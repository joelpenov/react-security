import auth0 from "auth0-js";

export default class Auth0Service {
  constructor(history) {
    this.history = history;
    this.permissionsRequested = "openid profile email read:courses";
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.permissionsRequested
    });

    this.ACCESS_TOKEN = "access_token";
    this.ID_TOKEN = "id_token";
    this.EXPIRES_AT = "expires_at";
    this.REDIRECT_ON_LOGIN_LOCATION = "redirect_on_login";
    this.PERMISSIONS = "permissions";
  }

  login = () => {
    localStorage.setItem(
      this.REDIRECT_ON_LOGIN_LOCATION,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
  };

  handleAuthorization = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        const redirectUrl = localStorage.getItem(
          this.REDIRECT_ON_LOGIN_LOCATION
        )
          ? JSON.parse(localStorage.getItem(this.REDIRECT_ON_LOGIN_LOCATION))
          : "/";
        this.history.push(redirectUrl);
      } else if (err) {
        alert(
          `There was an error ${
            err.error
          }. For more details please check the console.`
        );
        console.log(err);
      }
    });
  };

  setSession = authResult => {
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    const permissions = authResult.scope || this.permissionsRequested || "";

    localStorage.setItem(this.ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(this.ID_TOKEN, authResult.idToken);
    localStorage.setItem(this.EXPIRES_AT, expiresAt);
    localStorage.setItem(this.PERMISSIONS, permissions);
  };

  isAuthenticated = () => {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT);
    return new Date().getTime() < expiresAt;
  };

  logout = () => {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.ID_TOKEN);
    localStorage.removeItem(this.EXPIRES_AT);
    localStorage.removeItem(this.PERMISSIONS);
    localStorage.removeItem(this.REDIRECT_ON_LOGIN_LOCATION);
    this.userProfile = null;
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:1985/"
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN);
    if (!accessToken) {
      console.log("No access token available");
    }
    return accessToken;
  };

  getUserProfile = callback => {
    if (!this.isAuthenticated()) return null;
    if (this.userProfile) return this.userProfile;
    const accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (err) throw err;
      this.userProfile = profile;
      callback(this.userProfile);
    });
  };

  userHasPermission = permissions => {
    const grantedPermissions = localStorage
      .getItem(this.PERMISSIONS)
      .split(" ");

    return permissions.every(x => grantedPermissions.includes(x));
  };
}
