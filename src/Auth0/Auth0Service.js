import auth0 from "auth0-js";

export default class Auth0Service {
  constructor(history) {
    this.history = history;
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      responseType: "token id_token",
      scope: "openid profile email"
    });

    this.ACCESS_TOKEN = "access_token";
    this.ID_TOKEN = "id_token";
    this.EXPIRES_AT = "expires_at";
  }

  login = () => {
    this.auth0.authorize();
  };

  handleAuthorization = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push("/");
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

    localStorage.setItem(this.ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(this.ID_TOKEN, authResult.idToken);
    localStorage.setItem(this.EXPIRES_AT, expiresAt);
  };

  isAuthenticated = () => {
    const expiresAt = localStorage.getItem(this.EXPIRES_AT);
    return new Date().getTime() < expiresAt;
  };

  logout = () => {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.ID_TOKEN);
    localStorage.removeItem(this.EXPIRES_AT);
    this.userProfile = null;
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      returnTo: "http://localhost:1985/"
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem(this.ACCESS_TOKEN);
    if (!accessToken) {
      throw new Error("No access token available");
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
}
