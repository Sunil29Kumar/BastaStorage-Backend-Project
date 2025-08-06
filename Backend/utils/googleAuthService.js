import { OAuth2Client } from "google-auth-library";


const clientId = "336157970356-800im3ke3f1cqrtncg1bktsv8kvfg6rg.apps.googleusercontent.com"

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

