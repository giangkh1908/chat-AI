import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getCollection } from "../config/db.js";

export class RagService {
  constructor() {
    this.chain = null;
    this.db = null;
  }

  async initRetriever({
    model = "gemini-2.0-flash-exp",
    temperature = 0.6,
    kDocuments = 5,
    searchType = "mmr",
  }) {
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
      maxOutputTokens: 1048,
    });

    // Sử dụng MMR search với lambda = 0.5
    const retriever = this.db.asRetriever({
      k: kDocuments,
      searchType,
      searchKwargs:
        searchType === "mmr" ? { lambda: 0.5, fetchK: kDocuments * 2 } : {},
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
Bạn là một AI assistant thông minh và hữu ích. Hãy trả lời câu hỏi dựa trên thông tin được cung cấp.
{context}

Câu hỏi: {input}

Hướng dẫn trả lời:
- Trả lời bằng tiếng Việt một cách tự nhiên và dễ hiểu
- Sử dụng câu văn hoàn chỉnh, không dùng ký hiệu đặc biệt như *, -, #
- Trình bày thông tin một cách mạch lạc và súc tích
- Nếu có nhiều điểm, hãy viết thành đoạn văn liền mạch thay vì danh sách
- Hãy trả lời tối đa trong 5 đoạn văn, không vượt quá 1000 từ
- Nếu không tìm thấy thông tin liên quan, hãy nói "Tôi không tìm thấy thông tin để trả lời câu hỏi này."

Trả lời:
    `);

    const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });

    this.chain = await createRetrievalChain({
      combineDocsChain,
      retriever,
    });

    console.log("✅ RAG service initialized with MMR search (lambda=0.5)");
  }

  // Hàm xử lý và làm sạch response
  formatResponse(text) {
    return (
      text
        // Xóa markdown formatting
        .replace(/\*\*(.*?)\*\*/g, "$1") // Bold **text** -> text
        .replace(/\*(.*?)\*/g, "$1") // Italic *text* -> text
        .replace(/#{1,6}\s/g, "") // Headers # -> ""
        .replace(/`(.*?)`/g, "$1") // Code `text` -> text
        .replace(/^\s*[\*\-\+]\s/gm, "") // List bullets -> ""
        .replace(/^\s*\d+\.\s/gm, "") // Numbered lists -> ""

        // Xử lý line breaks
        .replace(/\n\s*\n/g, ". ") // Double line breaks -> ". "
        .replace(/\n/g, " ") // Single line breaks -> space

        // Clean up spacing
        .replace(/\s+/g, " ") // Multiple spaces -> single space
        .trim()
    ); // Remove leading/trailing spaces
  }

  async queryStream(question, res) {
    if (!this.chain) throw new Error("Chain not initialized!");

    // Bước 1: Thu thập toàn bộ response từ LLM
    let fullAnswer = "";
    const result = await this.chain.stream({ input: question });

    for await (const chunk of result) {
      if (chunk?.answer) {
        fullAnswer += chunk.answer;
      }
    }

    // Bước 2: Format lại cho sạch sẽ
    const cleanAnswer = this.formatResponse(fullAnswer);

    // Bước 3: Stream từng từ ra client
    const words = cleanAnswer.split(/\s+/);
    for (const w of words) {
      res.write(w + " ");
      await new Promise((resolve) => setTimeout(resolve, 30)); // optional: delay 30ms để giống typing
    }

    res.end();
  }
}
