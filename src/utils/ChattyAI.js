import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GeminiApi);

// A map to store chat instances for different chatrooms
const chatInstances = new Map();

export function getChatInstance(chatroomId) {
  // If this chatroom already has an instance, return it
  if (chatInstances.has(chatroomId)) {
    return chatInstances.get(chatroomId);
  }
  
  // Create a new model instance
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // Default system prompt if none is provided
  const defaultPrompt = `You are an AI assistant. Follow the user's instruction very precisely.
Instructions:
- Do NOT format the response in Markdown.
- Don't say "I can provide code snippets when needed".
- If the task involves code generation, start the output with "@code".
- If no code is needed, provide a concise and direct response.
- When generating code don't write anything else just the code no output no nothing.
- When asked for simple tasks don't generate code. Generate code only when specified.
- Keep the code clean, properly indented, and ready to use.`;


  const bot = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: defaultPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Hello! I am Chatty, your assistant. How can I help you today?" }],
      },
    ],
  });
  
  // Store the chat instance in our map
  chatInstances.set(chatroomId, bot);
  
  return bot;
}


export default async function ChattyAI(chatroomId, message) {
  if (typeof message !== "string" || message.trim() === "") {
    throw new Error("Invalid input: Message must be a non-empty string.");
  }

  try {
    const chatInstance = getChatInstance(chatroomId);
    const result = await chatInstance.sendMessage(message);
    
    if (result?.response?.text) {

      return result.response.text();
    } else {
      return "No valid response received from the assistant.";
    }
  } catch (error) {
    console.error(`Error in chatroom ${chatroomId}:`, error.message);
    throw error;
  }
}