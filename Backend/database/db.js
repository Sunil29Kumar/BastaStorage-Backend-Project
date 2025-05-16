import {MongoClient} from "mongodb";


export const client = new MongoClient("mongodb://127.0.0.1:27017");

export default async function connectDB() {
  await client.connect();
  const db = client.db("BastaStorage");
  console.log("Database connected");
  
  return db;
}
