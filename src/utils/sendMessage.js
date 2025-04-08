import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Call this function with a roomId
export const sendMessageToRoom = async (roomId, messageText, senderName) => {
  try {
    await addDoc(collection(db, "ChatRooms", roomId, "messages"), {
      text: messageText,
      sender: senderName,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error sending message to room: ", error);
  }
};
