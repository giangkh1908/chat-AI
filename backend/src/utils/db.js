import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let client;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_ATLAS_URI);
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas successfully");
  }
  return client;
}

export async function getCollection() {
  const client = await connectDB();
  return client
    .db(process.env.MONGODB_DB_NAME || "langchain_db1")
    .collection(process.env.MONGODB_COLLECTION_NAME || "embeddings1");
}

// Function để test kết nối
export async function testConnection() {
  try {
    const collection = await getCollection();
    const count = await collection.countDocuments();
    console.log(`✅ Database connection successful! Found ${count} documents in collection.`);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}
