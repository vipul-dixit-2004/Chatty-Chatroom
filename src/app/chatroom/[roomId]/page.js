'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, doc, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendMessageToRoom } from '@/utils/sendMessage';
import useRoomMessages from '@/hooks/useRoomMessages';
import MessageTextBox from '@/app/components/MessageTextBox';
import bcrypt from 'bcryptjs';

export default function ChatRoom() {
  const { roomId } = useParams();
  const messages = useRoomMessages(roomId);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [userVerified, setUserVerified] = useState(false);
  const [passKeyInput, setPassKeyInput] = useState('');
  const [storedPassKey, setStoredPassKey] = useState('');
  const [sending, setSending] = useState(false);
  const dates = new Set();
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId) fetchPassKey();
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, userVerified]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchPassKey = async () => {
    try {
      const roomQuery = query(
        collection(db, 'ChatRooms'),
        where('roomId', '==', Number(roomId))
      );

      const querySnapshot = await getDocs(roomQuery);

      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setStoredPassKey(docData.passKey);
      } else {
        setError("Room ID not found.");
        console.error("No room found with ID:", roomId);
      }
    } catch (err) {
      console.error("Error fetching room:", err);
      setError("Something went wrong fetching the room.");
    }
  };


  const handleAuthSubmit = () => {
    if (!passKeyInput || !nickname) {
      setError('Please enter both fields.');
      return;
    }

    const isMatch = bcrypt.compareSync(passKeyInput, storedPassKey);
    if (isMatch) {
      setUserVerified(true);
      setError('');
    } else {
      setError('Incorrect passkey.');
    }
  };


  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
      setSending(true);
      await sendMessageToRoom(roomId, message, nickname);
      setSending(false);
    }
  };

  const handleShare = async () => {
    navigator.clipboard.writeText(window.location);
    alert("Invite link copied!!");
  }

  const checkMessageDate = (date) => {
    const renderDate = new Date(date?.seconds * 1000).toDateString();
    if (dates.has(renderDate)) {
      return true;
    } else {
      dates.add(renderDate)
      return false;
    }
  }
  if (!userVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm shadow-lg space-y-4">
          <h2 className="text-2xl font-bold">🔐 Enter Room Details</h2>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
          />
          <input
            type="password"
            value={passKeyInput}
            onChange={(e) => setPassKeyInput(e.target.value)}
            placeholder="Enter room passkey"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleAuthSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen max-h-screen flex flex-col bg-gray-900 text-white p-4 max-w-2xl mx-auto">
      <div className='flex max-w-2xl flex-row justify-center items-center'>
        <h1 className="text-xl font-bold mb-4 text-center">💬 Chat Room - {roomId}</h1>
        <button className="text-md hidden md:block absolute pr-4 font-bold mb-4 right-0" onClick={handleShare}>Share 🔗</button>
        <button className="text-md md:hidden absolute pr-4 font-bold mb-4 right-0" onClick={handleShare}>🔗</button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 bg-gray-800 p-4 rounded-lg shadow-md max-h-[4/5]">
        {
          messages.map((msg, idx) => {
            const isSameDate = checkMessageDate(msg.timestamp);
            const showSender = idx === 0 || messages[idx - 1].sender !== msg.sender;

            return (
              <div key={msg.id}>
                {!isSameDate && msg.timestamp && (
                  <div className="text-center text-xs text-gray-400 my-2">
                    {new Date(msg.timestamp.seconds * 1000).toDateString()}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg whitespace-pre-wrap break-words my-1 ${msg.sender === nickname
                    ? 'bg-blue-600 text-white self-end'
                    : msg.sender === 'Chatty'
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-700 text-white'
                    }`}
                >
                  {showSender && (
                    <strong className="block mb-1">{msg.sender}</strong>
                  )}
                  <MessageTextBox textData={msg.text} />
                  <p className='text-right leading-0 text-[10px] w-full'>
                    {msg.timestamp
                      ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "recent"}
                  </p>
                </div>
              </div>
            );
          })
        }

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 mt-4"
      >
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message... or ask ChattyAI by @ai <msg>"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
          disabled={sending}
        >
          Send
        </button>
      </form>
    </div>
  );
}
