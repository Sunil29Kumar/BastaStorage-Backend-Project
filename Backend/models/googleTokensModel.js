import mongoose, { mongo, Schema } from "mongoose";


const googleTokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    tokens: {
        access_token: { type: String },
        refresh_token: { type: String },
        scope: { type: String },
        token_type: { type: String },
        expiry_date: { type: Number }
    }

})

const GoogleTokens = mongoose.model("GoogleTokens", googleTokenSchema);
export default GoogleTokens;