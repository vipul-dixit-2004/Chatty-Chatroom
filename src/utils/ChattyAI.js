import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GeminiApi });

export default async function ChattyAI(msg) {
  const prompt = `
You are an AI assistant. Follow the user's instruction very precisely.

Task: ${msg}

Instructions:
- Do NOT format the response in Markdown.
- Dont say I can provide code snippets when needed".
- If the task involves code generation, start the output with "@code".
- If no code is needed, provide a concise and direct response.
- When generating code dont write anything else jst the code no output no nothing.
- When asked for simple task don't generate code. Generate when specified 
- Keep the code clean, properly indented, and ready to use.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  console.log(response.text);
  return response.text;
}
