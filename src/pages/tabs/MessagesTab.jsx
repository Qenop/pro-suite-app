import React, { useState } from 'react';

const mockThreads = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'Can I pay rent tomorrow?',
    messages: [
      { sender: 'tenant', text: 'Can I pay rent tomorrow?', time: '10:12 AM' },
      { sender: 'admin', text: 'Sure, no problem.', time: '10:15 AM' }
    ]
  },
  {
    id: 2,
    name: 'Mary Wanjiku',
    lastMessage: 'Water issue resolved',
    messages: [
      { sender: 'tenant', text: 'Water issue resolved', time: '9:05 AM' },
      { sender: 'admin', text: 'Glad to hear!', time: '9:10 AM' }
    ]
  }
];

const MessagesTab = () => {
  const [selectedThread, setSelectedThread] = useState(mockThreads[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const updatedThread = {
      ...selectedThread,
      messages: [
        ...selectedThread.messages,
        { sender: 'admin', text: newMessage, time: 'Now' }
      ]
    };

    setSelectedThread(updatedThread);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col md:flex-row h-[75vh] bg-white border rounded-md shadow-sm">
      {/* Thread List */}
      <div className="w-full md:w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3">Inbox</h2>
        {mockThreads.map(thread => (
          <div
            key={thread.id}
            onClick={() => setSelectedThread(thread)}
            className={`cursor-pointer p-3 rounded-md hover:bg-gray-100 ${
              selectedThread.id === thread.id ? 'bg-gray-100' : ''
            }`}
          >
            <p className="font-medium">{thread.name}</p>
            <p className="text-sm text-gray-500 truncate">{thread.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Conversation View */}
      <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
        <div className="overflow-y-auto mb-4">
          <h3 className="text-lg font-semibold mb-2">{selectedThread.name}</h3>
          {selectedThread.messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 max-w-[75%] ${
                msg.sender === 'admin' ? 'ml-auto text-right' : ''
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.sender === 'admin'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center border-t pt-3">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
            placeholder="Type your reply..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
