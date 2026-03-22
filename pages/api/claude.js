export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { prompt, messages } = req.body;
    const msgs = messages || [{ role: "user", content: prompt }];

    const keyExists = !!process.env.CLAUDE_API_KEY;
    const keyStart = process.env.CLAUDE_API_KEY?.substring(0, 10) || "MISSING";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: msgs,
      }),
    });

    const data = await response.json();

    if (response.status !== 200) {
      return res.status(200).json({
        response: "DEBUG: Key exists: " + keyExists + " | Key starts: " + keyStart + " | API status: " + response.status + " | Error: " + JSON.stringify(data),
      });
    }

    const text = data.content?.[0]?.text || "";
    res.status(200).json({ response: text, content: data.content });
  } catch (error) {
    res.status(200).json({ response: "DEBUG ERROR: " + error.message });
  }
}
