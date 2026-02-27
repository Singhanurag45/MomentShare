import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateCaptions = async (req, res) => {
  try {
    const { imageBase64, imageUrl, mimeType } = req.body || {};

    if (!imageBase64 && !imageUrl) {
      return res
        .status(400)
        .json({ error: "imageBase64 or imageUrl is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not configured on the server." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction:
        "You are a social media expert. Analyze the emotions and setting of this image. Suggest 3 captions (one heartfelt, one funny, one short) and 5 trending hashtags. Return the response in JSON format with this exact structure: { \"captions\": { \"heartfelt\": string, \"funny\": string, \"short\": string }, \"hashtags\": string[] }.",
    });

    const parts = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(",")
        ? imageBase64.split(",")[1]
        : imageBase64;

      const safeMimeType =
        typeof mimeType === "string" && mimeType.trim().length > 0
          ? mimeType
          : "image/jpeg";

      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: safeMimeType,
        },
      });
    }

    if (imageUrl && !imageBase64) {
      parts.push({
        text:
          "The user has provided this image URL (you cannot fetch it, but infer from the URL context only if possible): " +
          imageUrl,
      });
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        },
      ],
    });

    const text = result?.response?.text?.() || "";

    if (!text) {
      return res.status(500).json({
        error: "The AI response was empty. Please try again.",
      });
    }

    let parsed;

    try {
      const jsonMatch = text.match(/```json([\s\S]*?)```/i);
      const rawJson = jsonMatch ? jsonMatch[1].trim() : text.trim();
      parsed = JSON.parse(rawJson);
    } catch (parseError) {
      return res.status(500).json({
        error: "Failed to parse AI response.",
        details: text,
      });
    }

    if (
      !parsed ||
      !parsed.captions ||
      !parsed.captions.heartfelt ||
      !parsed.captions.funny ||
      !parsed.captions.short ||
      !Array.isArray(parsed.hashtags)
    ) {
      return res.status(500).json({
        error:
          "AI response did not match the expected structure. Please try again.",
        details: parsed,
      });
    }

    return res.json(parsed);
  } catch (error) {
    console.error("Error generating AI captions:", error);

    const status = error?.response?.status || error?.status;

    if (status === 429) {
      return res.status(429).json({
        error:
          "The AI service is currently rate limited. Please wait a moment and try again.",
      });
    }

    return res.status(500).json({
      error: "An unexpected error occurred while generating AI captions.",
    });
  }
};

