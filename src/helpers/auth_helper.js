import { UserManager } from 'oidc-client';

const settings = {
  authority: "http://localhost:8080/realms/Spotify/",
  client_id: "spotify_react",
  redirect_uri: "http://localhost:4200/signin-callback.html",
  response_type: 'code',
  scope: "openid profile message.read",
};

const userManager = new UserManager(settings);

export const getUser = () => {
    return userManager.getUser();
}

export const login = () => {
    return userManager.signinRedirect();
}

export const logout = () => {
    return userManager.signoutRedirect();
}
