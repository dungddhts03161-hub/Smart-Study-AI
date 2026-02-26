const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/ask", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest"
    });

    const result = await model.generateContent(req.body.message);
    const text = result.response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("REAL ERROR:", error);
    res.status(500).json({ error: "Có lỗi khi gọi Gemini API" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});