import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

const rediclient = createClient({
    url: process.env.REDIS_URL,
});

await rediclient.connect()

export default rediclient;