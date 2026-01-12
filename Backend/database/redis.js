import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

const rediclient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    }
});

rediclient.on("error", (err) => console.log("Redis Error:", err));

await rediclient.connect()

export default rediclient;