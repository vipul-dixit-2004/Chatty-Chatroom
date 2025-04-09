import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";
import ChattyAI from "./ChattyAI";

// Call this function with a roomId
export const sendMessageToRoom = async (roomId, messageText, senderName) => {
  let useChattyAI = false;
  if(messageText.includes("@ai"))
    useChattyAI = true

  try {
    await addDoc(collection(db, "ChatRooms", roomId, "messages"), {
      text: messageText,
      sender: senderName,
      timestamp: serverTimestamp(),
    });
    if(useChattyAI){
      const response = await ChattyAI(messageText);
      await addDoc(collection(db, "ChatRooms", roomId, "messages"), {
        text: response,
        sender: "Chatty",
        timestamp: serverTimestamp(),
        });
    }
    
  } catch (error) {
    console.error("Error sending message to room: ", error);
  }
};
