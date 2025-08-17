import { google } from 'googleapis';
import { oauth2Client } from './googleDriveAuthService.js';


export const getNewAccessToken = async (refreshToken) => {

  oauth2Client.setCredentials({ refresh_token: refreshToken })

  const { credentials } = await oauth2Client.refreshAccessToken();
  console.log("cred =>", credentials);


  return {
    access_token: credentials.access_token,
    expiry_date: credentials.expiry_date
  };
}
