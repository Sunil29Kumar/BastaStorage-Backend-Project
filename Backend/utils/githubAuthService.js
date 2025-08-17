
import dotenv from "dotenv";
dotenv.config();
export async function fetchGithubUser(code) {

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // important!
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code,
        }),
    });

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) return false;

    // 2️⃣ Use access_token to get user info
    const userResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userData = await userResponse.json();


    // user email 
    const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailData = await emailResponse.json();
    const email = emailData.find(email => email.primary)?.email;


    return { userData, email }

}
