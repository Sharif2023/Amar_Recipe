import React, { useState, useEffect } from 'react';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const ChatModal = ({ isOpen, onClose, senderId }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [filteredAdmins, setFilteredAdmins] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetch(getApiUrl(API_CONFIG.ADMIN_MANAGEMENT.GET_REQUESTS))
        .then(response => response.json())
        .then(data => {
          const approvedAdmins = data.filter(admin => admin.status === 'approved');
          setAdmins(approvedAdmins);
          setFilteredAdmins(approvedAdmins); // Set filtered admins to be the approved ones
        })
        .catch(error => {
          console.error("Error fetching admin data:", error);
        });
    }
  }, [isOpen]);

  // Fetch messages when a new chat is selected
  useEffect(() => {
    if (selectedAdmin) {
      fetchMessages(selectedAdmin.id);
    }
  }, [selectedAdmin]);

  //auto scroll to down
  useEffect(() => {
    const chatContainer = document.getElementById('chat-box');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);


  const fetchMessages = (receiverId) => {
    fetch(`${getApiUrl(API_CONFIG.MESSAGES.GET_MESSAGES)}?sender_id=${senderId}&receiver_id=${receiverId}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages);
        } else {
          console.error('Failed to fetch messages');
        }
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  };


  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredAdmins(admins.filter(admin => admin.name.toLowerCase().includes(query)));
  };

  const handleSendMessage = () => {
    if (userInput.trim() && selectedAdmin) {
      const newMessages = [...messages, { sender: 'user', text: userInput }];
      setMessages(newMessages);
      setUserInput('');

      const messageData = {
        sender_id: senderId,
        receiver_id: selectedAdmin.id,
        message: userInput,
      };

      fetch(getApiUrl(API_CONFIG.MESSAGES.SEND_MESSAGE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            fetchMessages(selectedAdmin.id); // Re-fetch messages after sending
          } else {
            console.error('Failed to send message:', data.message);
          }
        })
        .catch(error => {
          console.error('Error sending message:', error);
        });
    }
  };

  const handleBackToList = () => {
    setSelectedAdmin(null); // Set the selected admin to null to show the list again
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-90 bg-white shadow-2xl rounded-lg max-w-lg z-50">
      <div className="p-4 border-b bg-red-500 text-white rounded-t-lg flex justify-between items-center">
        {selectedAdmin && (
          <button
            onClick={handleBackToList}
            className="text-white mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
        <p className="text-lg font-semibold">{selectedAdmin ? `${selectedAdmin.name}` : 'অ্যাডমিন বার্তা'}</p>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-400 focus:outline-none focus:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Admin Selection */}
      {!selectedAdmin && (
        <div className="p-4">
          <input
            type="text"
            placeholder="অ্যাডমিনদের খুজুন..."
            onChange={handleSearch}
            className="w-full px-3 py-2 mb-2 border rounded-md"
          />
          <ul className="max-h-48 overflow-y-auto">
            {filteredAdmins.map(admin => (
              <li key={admin.id} onClick={() => setSelectedAdmin(admin)} className="cursor-pointer p-2 mb-1 rounded-lg shadow bg-gray-100 hover:bg-gray-200">
                {admin.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Messages */}
      {selectedAdmin && (
        <>
          <div id="chat-box" className="p-4 h-80 overflow-y-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 flex ${msg.sender_id == senderId ? 'justify-end' : 'justify-start'}`}
              >
                <div>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow ${msg.sender_id == senderId
                      ? 'bg-red-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                  >
                    {msg.message}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-right pr-1">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              placeholder="Type a message"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button onClick={handleSendMessage} className="bg-red-500 text-white px-4 py-2 rounded-r-md hover:bg-red-600 transition duration-300">
              পাঠান
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatModal;
