
import { createClient } from "redis";

const rediclient = createClient();

rediclient.on("error", (err) => {
    console.log("Redis client Error", err);
    process.exit(1)
})

await rediclient.connect()

export default rediclient;