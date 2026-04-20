import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Call this function with a roomId
export const sendMessageToRoom = async (roomId, messageText, senderName) => {
  let useChattyAI = false;
  if (messageText.includes("@ai"))
    useChattyAI = true

  try {
    await addDoc(collection(db, "ChatRooms", roomId, "messages"), {
      text: messageText,
      sender: senderName,
      timestamp: serverTimestamp(),
    });
    if (useChattyAI) {
      const response = await fetch("/api/chatty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, message: messageText }),
      });
      const data = await response.json();
      await addDoc(collection(db, "ChatRooms", roomId, "messages"), {
        text: data?.text || "No valid response received from the assistant.",
        sender: "Chatty",
        timestamp: serverTimestamp(),
      });
    }

  } catch (error) {
    console.error("Error sending message to room: ", error);
  }
};
