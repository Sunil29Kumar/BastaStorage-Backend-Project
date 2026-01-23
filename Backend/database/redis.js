import dotenv from "dotenv";
dotenv.config();


import { createClient } from "redis";

const rediclient = createClient({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 2000), // Reconnect logic
        connectTimeout: 10000 // 10 seconds timeout
    }
});

rediclient.on("error", (err) => console.error("❌ Redis Error:", err));
rediclient.on("connect", () => console.log("✅ Redis Client Connected"));

// Connection handle karne ke liye function
export const connectRedis = async () => {
    if (!rediclient.isOpen) {
        await rediclient.connect();
    }
};

export default rediclient;