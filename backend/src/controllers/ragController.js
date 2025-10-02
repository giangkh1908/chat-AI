import { RagService } from "../services/ragService.js";

const ragService = new RagService();

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    console.log(`📝 [Stream] Question: ${question}`);

    // Cấu hình response để hỗ trợ streaming
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Khởi tạo retriever nếu chưa có
    if (!ragService.chain) {
      await ragService.initRetriever({});
    }

    // Gọi stream trong RagService
    await ragService.queryStream(question, res);

  } catch (err) {
    console.error("❌ Error stream:", err.message);
    res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
    res.end();
  }
}
