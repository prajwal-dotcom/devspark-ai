export default async function handler(req, res) {

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
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

    let text = "";

    if (data?.candidates?.length > 0) {
      text = data.candidates[0].content.parts
     .map(part => part.text)
     .join("");
}

res.status(200).json({ text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI request failed" });
  }
}