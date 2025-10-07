import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_ATLAS_URI;

  await mongoose.connect(mongoURI).then(() => console.log("DB Connected"));
};

export function getDB() {
  if (!mongoose.connection) {
    throw new Error("Database not connected. Call connectDB first.");
  }
  return mongoose.connection;
}

export async function getCollection() {
  const client = await connectDB();
  return client
    .db(process.env.MONGODB_DB_NAME || "langchain_db1")
    .collection(process.env.MONGODB_COLLECTION_NAME || "embeddings1");
}

// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.
