import auth0 from "auth0-js";

let _accessToken = "";
let _expiresAt = 0;
let _permissions = 0;

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
    this.PERMISSIONS = "permissions";
    this.REDIRECT_ON_LOGIN_LOCATION = "redirect_on_login";
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
    _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    _permissions = authResult.scope || this.permissionsRequested || "";

    _accessToken = authResult.accessToken;
  };

  isAuthenticated = () => {
    return new Date().getTime() < _expiresAt;
  };

  logout = () => {
    _accessToken = "";
    _expiresAt = 0;

    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:1985/"
    });
  };

  getAccessToken = () => {
    const accessToken = _accessToken;
    if (!accessToken) {
      console.log("No access token available");
    }
    return _accessToken;
  };

  getUserProfile = callback => {
    if (!this.isAuthenticated()) return null;
    if (this.userProfile) callback(this.userProfile);
    const accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (err) throw err;
      this.userProfile = profile;
      callback(this.userProfile);
    });
  };

  renewToken(callback) {
    this.auth0.checkSession({}, (err, authResult) => {
      if (err) {
        console.log(err);
      } else if (authResult) {
        this.setSession(authResult);
      }

      if (callback) {
        callback(err, authResult);
      }
    });
  }

  userHasPermission = permissions =>
    permissions.every(x => _permissions.includes(x));
}
