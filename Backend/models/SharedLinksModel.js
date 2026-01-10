import mongoose, { Schema } from "mongoose";

const SharedLinksSchema = new Schema({
    fileId:{
        type:Schema.Types.ObjectId,
        ref:"File"
    },
    token:{
        type:String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60*60, // 1 hour
    },
})

const SharedLink = mongoose.model("SharedLinks", SharedLinksSchema);

export default SharedLink;