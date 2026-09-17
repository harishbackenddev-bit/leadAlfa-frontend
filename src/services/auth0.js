// src/services/auth0.js
const { VITE_DOMAIN, VITE_CLIENT_ID, VITE_REDIRECT_URI, VITE_CLIENT_SECRET } =
  import.meta.env;

const domain = VITE_DOMAIN;
const clientId = VITE_CLIENT_ID;
const redirectUri = VITE_REDIRECT_URI;
const clientSecret = VITE_CLIENT_SECRET;

// --- Social Login ---
export function loginWithSocial(provider) {
  const url =
    `https://${domain}/authorize?` +
    new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      connection: provider, // google-oauth2, facebook, apple
      redirect_uri: redirectUri,
      scope: "openid profile email",
    });

  window.location.href = url;
}

// --- Logout ---
export function logout() {
  const logoutUrl =
    `https://${domain}/v2/logout?` +
    new URLSearchParams({
      client_id: clientId,
      returnTo: window.location.origin,
    });

  window.location.href = logoutUrl;
}

// --- Handle Code Callback ---
export async function handleRedirectCallback(code) {
  // return code;
  const response = await fetch(`https://${domain}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret, // move this to backend if deploying
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = await response.json();

  // Get user profile using the access_token
  const userRes = await fetch(`https://${domain}/userinfo`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`
    }
  });

  const userProfile = await userRes.json();

  return {
    ...tokenData,
    user: userProfile
  };
}
