import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

const rediclient = createClient({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    
});

rediclient.on("error", (err) => console.log("Redis Error:", err));

await rediclient.connect()

export default rediclient;