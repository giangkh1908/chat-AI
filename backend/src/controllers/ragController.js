import { RagService } from "../services/ragService.js";

const ragService = new RagService();

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    console.log(`📝 Question: ${question}`);

    // Khởi tạo retriever nếu chưa có
    if (!ragService.chain) {
      await ragService.initRetriever({});
    }

    const answer = await ragService.query(question);
    console.log(`✅ Answer: ${answer.substring(0, 100)}...`);
    
    res.json({ answer });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
