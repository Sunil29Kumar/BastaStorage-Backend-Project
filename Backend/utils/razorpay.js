import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";

const razor = new Razorpay({
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_KEY_SECRET
});

export default razor;