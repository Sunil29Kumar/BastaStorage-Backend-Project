import { google } from 'googleapis';
import { oauth2Client } from './googleDriveAuthService.js';


export const getNewAccessToken = async (refreshToken) => {

  oauth2Client.setCredentials({ refresh_token: refreshToken })

  const { credentials } = await oauth2Client?.refreshAccessToken();

  return {
    access_token: credentials.access_token,
    expiry_date: credentials.expiry_date
  };

  // const { token } = await oauth2Client.getAccessToken();

  // return {
  //   access_token: token,
  //   expiry_date: Date.now() + 3500 * 1000 // ~1h validity
  // };
}
