// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';

// interface Message {
//     id: number;
//     senderId: number;
//     receiverId: number;
//     content: string;
//     createdAt: string;
//     updatedAt: string;
//     chatId: number;
// }

// const ChatRoom: React.FC = () => {
//     const { chatId } = useParams<{ chatId: string }>();
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [parsedUser, setParsedUser] = useState<{ id: number, Username: string } | null>(null);

//     useEffect(() => {
//         const loggedInUser = localStorage.getItem('user');
//         if (loggedInUser) {
//             setParsedUser(JSON.parse(loggedInUser));
//         }
//     }, []);

//     useEffect(() => {
//         const fetchMessages = async () => {
//             if (!parsedUser) return;

//             try {
//                 const response = await fetch(`http://localhost:3007/api/messages/getMessages?chatId=${chatId}`);
//                 if (!response.ok) {
//                     throw new Error('Failed to fetch messages');
//                 }
//                 const data = await response.json();
//                 setMessages(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 console.error('Error fetching messages:', error);
//             }
//         };

//         fetchMessages();
//     }, [chatId, parsedUser]);

//     const handleSendMessage = async () => {
//         if (!newMessage.trim()) return;

//         try {
//             const response = await fetch('http://localhost:3007/api/messages/createMessage', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     senderId: parsedUser?.id,
//                     receiverId: Number(chatId), // Assuming chatId is the receiverId
//                     chatId: Number(chatId),
//                     content: newMessage,
//                 }),
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to send message');
//             }
//             const data = await response.json();
//             setMessages([...messages, data]);
//             setNewMessage('');
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen">
//             <header className="bg-green-600 text-white p-4">
//                 <h1 className="text-2xl">Chat Room</h1>
//             </header>
//             <main className="flex-grow p-4 overflow-y-auto">
//                 <ul className="space-y-4">
//                     {messages.map((message) => (
//                         <li
//                             key={message.id}
//                             className={`p-4 rounded-md shadow-md ${
//                                 message.senderId === parsedUser?.id ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'
//                             }`}
//                         >
//                             <p>{message.content}</p>
//                             <p className="text-sm">{new Date(message.createdAt).toLocaleString()}</p>
//                         </li>
//                     ))}
//                 </ul>
//             </main>
//             <footer className="p-4 bg-gray-200">
//                 <div className="flex gap-2">
//                     <input
//                         type="text"
//                         value={newMessage}
//                         onChange={(e) => setNewMessage(e.target.value)}
//                         className="flex-grow p-2 border rounded-md"
//                         placeholder="Type your message..."
//                     />
//                     <button
//                         onClick={handleSendMessage}
//                         className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition duration-300"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default ChatRoom;