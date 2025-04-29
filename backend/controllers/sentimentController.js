import fetch from "node-fetch";

export const analyzeSentiment = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required." });

  const HF_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest";
  const HF_TOKEN = process.env.HUGGINGFACE_TOKEN; // Place your token in .env

  try {
    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(HF_TOKEN ? { "Authorization": `Bearer ${HF_TOKEN}` } : {}),
      },
      body: JSON.stringify({ inputs: text }),
    });

    const contentType = response.headers.get("content-type");
    const responseText = await response.text();

    if (!response.ok) {
      return res.status(502).json({ error: `Hugging Face API error: ${response.status} ${responseText}` });
    }

    if (contentType && contentType.includes("application/json")) {
      const result = JSON.parse(responseText);
      // The model returns an array of [{label, score}, ...]
      let sentiment = "emotional";
      if (Array.isArray(result) && result.length > 0) {
        const labelValue = result[0][0]?.label ?? result[0]?.label ?? "";
        if (labelValue === "LABEL_2" || /positive/i.test(labelValue)) sentiment = "happy";
        else if (labelValue === "LABEL_0" || /negative/i.test(labelValue)) sentiment = "sad";
        else if (labelValue === "LABEL_1" || /neutral/i.test(labelValue)) sentiment = "emotional";
        // If angry detection is needed, look for keywords in original text.
        if (/(angry|furious|mad|hate)/i.test(text)) sentiment = "angry";
      }
      return res.json({ sentiment });
    } else {
      return res.status(500).json({ error: "Unexpected non-JSON response from sentiment API." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Sentiment API call failed: " + err.message });
  }
};