
export async function fetchGithubUser(code) {


    const client_id = "Ov23liPF52IMctxkH6Jm";
    const client_secret = "fc88f407d51c8ad019214011a202342e66df1026";

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
