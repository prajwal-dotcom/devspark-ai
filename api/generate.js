export default async function handler(req, res) {

const { prompt } = req.body;

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

const text =
data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

res.status(200).json({ text });

} catch (error) {

res.status(500).json({ error: "AI request failed" });

}

}