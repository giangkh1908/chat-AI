import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
// import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

/** Kết nối MongoDB và trả về collection */
async function getCollection() {
  const client = new MongoClient(process.env.MONGODB_ATLAS_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  return db.collection(process.env.MONGODB_COLLECTION_NAME);
}

/** Lấy tất cả file PDF/TXT/DOCX trong materials */
function getFilesFromMaterials() {
  const materialsDir = path.resolve("./materials");
  const allFiles = fs.readdirSync(materialsDir)
    .filter(f => [".pdf", ".txt", ".docx"].includes(path.extname(f).toLowerCase()))
    .map(f => path.join(materialsDir, f));
  return allFiles;
}

/** Chạy ingest tự động */
async function ingest() {
  try {
    const collection = await getCollection();
    const embedding = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const files = getFilesFromMaterials();
    if (files.length === 0) {
      console.log("⚠️  Không tìm thấy file PDF/TXT/DOCX trong materials");
      return;
    }

    let docs = [];
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      let loader;
      if (ext === ".pdf") loader = new PDFLoader(file);
      else if (ext === ".txt") loader = new TextLoader(file);
      else if (ext === ".docx") loader = new DocxLoader(file);

      if (loader) {
        const loaded = await loader.load();
        docs.push(...loaded);
      }
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 30
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const vectorStore = new MongoDBAtlasVectorSearch(embedding, {
      collection,
      indexName: process.env.MONGODB_INDEX_NAME || "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    });

    await vectorStore.addDocuments(splitDocs);
    console.log(`✅ Ingested ${splitDocs.length} chunks into MongoDB`);
    process.exit(0);

  } catch (err) {
    console.error("❌ Ingest failed:", err);
    process.exit(1);
  }
}

ingest();
