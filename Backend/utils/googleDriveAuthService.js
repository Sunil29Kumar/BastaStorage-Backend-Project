import { google } from "googleapis";
import dotenv from "dotenv";
import GoogleTokens from "../models/googleTokensModel.js";
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;

export const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);


// google drive URL 
export const googleDriveAuthUrl = async (req, res) => {
    // Generate a url that asks permissions for the Drive activity and Google Calendar scope
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        // prompt: "consent",
        scope: [process.env.GOOGLE_DRIVE_SCOPE_1]
    });

    res.redirect(url);
};