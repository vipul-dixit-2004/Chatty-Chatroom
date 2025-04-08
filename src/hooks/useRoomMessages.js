'use client'
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useRoomMessages = (roomId) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!roomId || typeof roomId !== "string") {
      console.warn("Invalid roomId:", roomId);
      return;
    }

    const q = query(
      collection(db, "ChatRooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [roomId]);

  return messages;
};

export default useRoomMessages;