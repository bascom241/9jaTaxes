import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateArticleSummary = async (article) => {
  console.log("generateArticleSummary called");
  console.log("Article content length:", article.length);

  const prompt = `
Article Content:
"""
${article}
"""

Task:
1. Generate a clear, concise summary of the article.
2. The summary must be between 2–4 sentences.
3. Do NOT add new information.
4. Do NOT include headings, bullet points, or explanations.
5. Return ONLY the summary text.
6. Respond strictly in JSON format like this:

{
  "main": "string",
  "length": number
}

Rules:
- "main" must contain only the summary text.
- "length" must be the number of words in the summary.
- Do not include any text outside the JSON object.
`;

  try {
    console.log("Sending request to OpenAI API...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer that generates article summaries in JSON format"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 300
    });

    console.log("Raw OpenAI response:", response);

    const result = response.choices[0].message.content;
    console.log("OpenAI response content:", result);

    try {
      const parsed = JSON.parse(result);
      console.log("Parsed summary JSON:", parsed);
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse JSON, returning raw summary:", parseError);
      return {
        main: result,
        length: result.split(/\s+/).length
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error; // optionally rethrow so the calling function knows
  }
};
