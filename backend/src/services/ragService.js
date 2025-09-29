import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getCollection } from "../utils/db.js";

export class RagService {
  constructor() {
    this.chain = null;
    this.db = null;
  }

  async initRetriever({ model = "gemini-2.0-flash-exp", temperature = 0.6, kDocuments = 5, searchType = "mmr" }) {
    const collection = await getCollection();

    const embedding = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    this.db = new MongoDBAtlasVectorSearch(embedding, {
      collection,
      indexName: process.env.MONGODB_INDEX_NAME || "vector_index1",
      textKey: "text",
      embeddingKey: "embedding",
    });

    const llm = new ChatGoogleGenerativeAI({
      model,
      apiKey: process.env.GOOGLE_API_KEY,
      temperature,
    });

    // Sử dụng MMR search với lambda = 0.5
    const retriever = this.db.asRetriever({ 
      k: kDocuments, 
      searchType: "mmr",
      searchKwargs: {
        lambda: 0.5, // Cân bằng giữa relevance và diversity
        fetchK: kDocuments * 2 // Fetch nhiều candidates hơn để MMR có thể chọn
      }
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
Bạn là một AI assistant thông minh, trả lời câu hỏi dựa trên thông tin được cung cấp.

Thông tin tham khảo:
{context}

Câu hỏi: {input}

Hãy trả lời câu hỏi một cách chính xác và chi tiết bằng tiếng Việt. Nếu không tìm thấy thông tin liên quan, hãy nói "Tôi không tìm thấy thông tin để trả lời câu hỏi này."

Trả lời:
    `);

    const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });

    this.chain = await createRetrievalChain({
      combineDocsChain,
      retriever,
    });

    console.log("✅ RAG service initialized with MMR search (lambda=0.5)");
  }

  async query(question) {
    if (!this.chain) throw new Error("Chain not initialized!");

    const result = await this.chain.invoke({ input: question });
    return result.answer;
  }
}
