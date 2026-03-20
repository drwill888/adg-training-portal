export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { prompt, messages } = req.body;

    // Support both { prompt: "..." } and { messages: [...] }
    const msgs = messages || [{ role: "user", content: prompt }];

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

    // Return the text response directly for modules using data.response
    const text = data.content?.[0]?.text || "";
    res.status(200).json({ response: text, content: data.content });
  } catch (error) {
    res.status(500).json({ error: "API request failed" });
  }
}
