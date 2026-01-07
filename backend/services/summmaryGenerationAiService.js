
import OpenAI from "openai"


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const generateArticleSummary = async (article) => {
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



    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system", content: "You are an expert content writer that generate article summary in json format"
            },
            {
                role: "user", content: prompt
            }
        ],
        max_tokens: 300
    })

    const result = response.choices[0].message.content;
    try {
        const parsed = JSON.parse(result);
        return parsed
    } catch (error) {
        return {  main: result,
      length: result.split(/\s+/).length }
    }
};