'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [passKey, setPassKey] = useState('');
  const [chatRoomId, setChatRoomId] = useState('');
  const [errorMsg,setErrorMsg] = useState('');
  
  const handleCreateRoom = async () => {
    const timestamp = Date.now();
    const randomId = Math.floor((timestamp / 100) % 10000000);
    console.log('Random ID:', randomId);

    localStorage.setItem('LastRoomID', randomId.toString());
    await storeNewRoomID(randomId, passKey);
  };

  const handleJoinRoom = async () =>{
    if(chatRoomId.length<7){
      setErrorMsg('Invalid RoomId');
      return
    }
    router.push(`/chatroom/${chatRoomId}`)

    setShowJoinModal(false)
  }

  const storeNewRoomID = async (roomId, passKey) => {
    try {
      const response = await addDoc(collection(db, 'ChatRooms'), {
        roomId,
        passKey,
        createdAt: new Date(),
      });
      console.log('Room created with ID:', roomId);
      console.log(response?.id);
      router.push(`/chatroom/${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-8">💬 Chatty</h1>

      <div className="flex flex-col md:flex-row gap-2 items-center">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg text-lg font-medium"
        >
          Create Chat Room
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          className="bg-gray-700 hover:bg-gray-800 transition px-6 py-2 rounded-lg text-lg font-medium"
        >
          Join Chat Room
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">🔐 Set Room Passkey</h2>
            <input
              type="text"
              value={passKey}
              onChange={(e) => setPassKey(e.target.value)}
              placeholder="Enter a passkey..."
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleCreateRoom();
                  setShowModal(false);
                }}
                disabled={!passKey}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Join Chat Room</h2>
            
            <input
              type="text"
              value={chatRoomId}
              onChange={(e) => setChatRoomId(e.target.value)}
              placeholder="Enter the Chat Room Id..."
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className='text-red-600'>{errorMsg}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setErrorMsg('')
                  handleJoinRoom();
                }}
                disabled={!chatRoomId}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
