import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/user/userHome',
  clientId:
    '585658094459-fi70ddmdcfcaapcmgj7hahheahnek4t5.apps.googleusercontent.com',
  scope: 'openid profile email',
  responseType: 'id_token token',
  showDebugInformation: true,
};
