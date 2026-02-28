require("dotenv").config();
console.log("API KEY:", process.env.GEMINI_API_KEY);
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Tạo API chat
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Có lỗi xảy ra" });
  }
});

app.listen(3000, () => {
  console.log("Server đang chạy ở http://localhost:3000");
});