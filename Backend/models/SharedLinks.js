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
      expires: 60*10, // 10 minutes
    },
})

const SharedLink = mongoose.model("SharedLinks", SharedLinksSchema);

export default SharedLink;