export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { prompt, messages } = req.body;
    const msgs = messages || [{ role: "user", content: prompt }];

    console.log("CLAUDE_API_KEY exists:", !!process.env.CLAUDE_API_KEY);
    console.log("CLAUDE_API_KEY starts with:", process.env.CLAUDE_API_KEY?.substring(0, 10));

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
    console.log("Anthropic response status:", response.status);
    console.log("Anthropic response:", JSON.stringify(data).substring(0, 200));

    const text = data.content?.[0]?.text || "";
    res.status(200).json({ response: text, content: data.content });
  } catch (error) {
    console.error("Claude API error:", error);
    res.status(500).json({ error: "API request failed" });
  }
}
```

Save it, commit, and push:
```
git add .
git commit -m "Add debug logging to claude API"
git push origin main