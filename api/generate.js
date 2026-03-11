export default async function handler(req, res) {

  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is missing" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  try {

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("Gemini response:", JSON.stringify(data));

    // Handle API quota errors
    if (data.error) {
      return res.status(200).json({
        text: "⚠️ AI request limit reached. Please try again later."
      });
    }

    let text = "";

    if (data?.candidates?.length > 0) {
      text = data.candidates[0].content.parts
        .map(part => part.text)
        .join("");
    }

    res.status(200).json({ text });

  } catch (error) {

    console.error("Server error:", error);

    res.status(500).json({
      text: "⚠️ AI request failed. Please try again."
    });

  }
}