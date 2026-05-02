import dotenv from "dotenv"
import OpenAI from "openai"

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const askAI = async ({ question, context, extractedText }) => {
  const prompt = `
You are a helpful academic assistant for students.

Use the LMS context and extracted file text to answer the student's question.

Rules:
- Do not make up information.
- If the answer is not in the context or file, say that clearly.
- Use easy English.

LMS Context:
${JSON.stringify(context, null, 2)}

Extracted File Text:
${extractedText || "No file text found."}

Student Question:
${question}
`

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You help students understand lectures, modules, files, and assignments."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  })

  return response.choices[0].message.content
}