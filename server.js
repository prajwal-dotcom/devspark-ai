import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "AIzaSyBpT0XKqAAwYF9r9_Wm9kBNEgj5PrtjBHg";

const genAI = new GoogleGenerativeAI(API_KEY);

app.post("/generate", async (req, res) => {

try {

const prompt = req.body.prompt;

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash"
});

const result = await model.generateContent(prompt);

const text = result.response.text();

res.json({ text });

} catch (error) {

console.error("Gemini error:", error);

res.json({
error: "AI request failed"
});

}

});

app.listen(3000, () => {
console.log("Server running on port 3000");
});