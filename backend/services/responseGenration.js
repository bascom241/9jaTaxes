import OpenAI from "openai";
import Chunk from "../models/Chunk.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function getRelevantChunks(chunks, question, limit = 5) {
  const keywords = question
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3);

  const scored = chunks.map(chunk => {
    const text = chunk.content.toLowerCase();
    let score = 0;

    for (const word of keywords) {
      if (text.includes(word)) score++;
    }

    return { chunk, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.chunk);
}

export const generateResponse = async (question) => {
  const allChunks = await Chunk.find();

  const relevantChunks = getRelevantChunks(allChunks, question);

  const context = relevantChunks.length
    ? relevantChunks.map(c => c.content).join("\n\n")
    : "";

  const prompt = `

DOCUMENT:
"""
${context}
"""

USER QUESTION:
"""
${question}
"""

Task:
1. First, check if the question can be answered using the DOCUMENT.
2. If YES:
   - Answer using ONLY the document.
   - Set "source" to "document".
3. If NO:
   - Answer using your general knowledge.
   - Set "source" to "general".
4. Do NOT invent information from the document.
5. Return ONLY valid JSON.

Response format:
{
  "source": "document" | "general",
  "answer": "string"
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a precise chat assistant that responds strictly in JSON."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 300,
    temperature: 0.2
  });

  const result = response.choices[0].message.content;

  try {
    return JSON.parse(result);
  } catch {
    return {
      main: result,
      length: result.split(/\s+/).length
    };
  }
};
