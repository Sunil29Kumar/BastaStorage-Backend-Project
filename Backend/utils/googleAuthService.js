import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const clientId = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client({
    clientId,
});

export async function verifyIdToken(idToken) {
    const loginTicket = await googleClient.verifyIdToken({
        idToken,
        audience: clientId
    })
    const userData = loginTicket.payload

    return userData
}

