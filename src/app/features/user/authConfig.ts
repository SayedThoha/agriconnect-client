// import { AuthConfig } from 'angular-oauth2-oidc';

// export const authConfig: AuthConfig = {

//   issuer: 'https://accounts.google.com',

//   redirectUri: window.location.origin,

//   clientId: "585658094459-fi70ddmdcfcaapcmgj7hahheahnek4t5.apps.googleusercontent.com",

//   scope: 'openid profile email',

//   strictDiscoveryDocumentValidation: false,

// };

import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/user/userHome',
  clientId:
    '585658094459-fi70ddmdcfcaapcmgj7hahheahnek4t5.apps.googleusercontent.com', // Replace with your Google Client ID
  scope: 'openid profile email',
  responseType: 'id_token token',
  showDebugInformation: true,
  // useSilentRefresh: false, // Disable automatic silent refresh
  
};

//
