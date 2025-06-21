import mongoose from "mongoose";

// export default async function connectDB() {
//   try {
await mongoose.connect(
  "mongodb://sunil:sunil@localhost:27017/BastaStorage?replicaSet=myReplicaSetSunil"
);
//     console.log("Database connected");
//   } catch (error) {
//     console.log(error);
//     process.exit(1);
//   }
// }

// process.on("SIGINT", async () => {
//   await mongoose.disconnect();
//   console.log("client connected");
//   process.exit.apply(0);
// });
