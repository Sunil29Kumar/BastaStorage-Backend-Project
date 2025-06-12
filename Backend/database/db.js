import {MongoClient} from "mongodb";

// export const client = new MongoClient(
//   "mongodb://sunil:sunil@localhost:27017/BastaStorage"
// );
export const client = new MongoClient(
  "mongodb://sunil:sunil@localhost:27017/BastaStorage?replicaSet=myReplicaSetSunil"
);

export default async function connectDB() {
  await client.connect();
  const db = client.db("BastaStorage");
  console.log("Database connected");

  return db;
}
