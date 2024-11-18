import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

interface Message {
    userId: number;
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    chatId: number;
}

interface User {
    id: number;
    Username: string;
    userId: number;
}

interface ParsedUser {
    Username: string;
    userId: number;
    languagePreference: string;
}

interface ActiveUser {
    Username: string;
    id: number;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [parsedUser, setParsedUser] = useState<ParsedUser | null>(null);
    const [activeUser, setActiveUser] = useState<ActiveUser | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3007/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                alert('Failed to connect to the server');
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            setParsedUser(JSON.parse(loggedInUser));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const translateMessage = async (text: string, targetLang: string): Promise<string> => {
        try {
            const response = await fetch('http://localhost:3007/api/messages/translateMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, targetLang }),
            });
            if (!response.ok) throw new Error('Failed to translate message');
            const data = await response.json();
            return data.translatedText;
        } catch (error) {
            console.error('Error translating message:', error);
            return text;
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!parsedUser || !activeUser) return;

            try {
                const response = await fetch(
                    `http://localhost:3007/api/messages/getMessages?user1=${parsedUser.userId}&user2=${activeUser.id}`
                );
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();

                const translatedMessages = await Promise.all(
                    data.map(async (message: Message) => {
                        if (
                            parsedUser.languagePreference &&
                            parsedUser.languagePreference !== 'en'
                        ) {
                            message.content = await translateMessage(
                                message.content,
                                parsedUser.languagePreference
                            );
                        }
                        return message;
                    })
                );

                setMessages(translatedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [activeUser, parsedUser]);

    useEffect(() => {
        const newSocket = io('http://localhost:3007', { withCredentials: true });
        setSocket(newSocket);

        newSocket.on('connect', () => console.log('Socket.io connection established'));

        newSocket.on('message', async (message: string) => {
            const parsedMessage: Message = JSON.parse(message);
            if (parsedMessage.senderId !== parsedUser?.userId) {
                if (
                    parsedUser?.languagePreference &&
                    parsedUser.languagePreference !== 'en'
                ) {
                    parsedMessage.content = await translateMessage(
                        parsedMessage.content,
                        parsedUser.languagePreference
                    );
                }
                setMessages((prevMessages) => [...prevMessages, parsedMessage]);
            }
        });

        newSocket.on('disconnect', () => console.log('Socket.io connection closed'));

        return () => {
            newSocket.close();
        };
    }, [parsedUser]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const response = await fetch('http://localhost:3007/api/messages/createMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderId: parsedUser?.userId,
                    receiverId: activeUser?.id,
                    content: newMessage,
                }),
            });
            if (!response.ok) throw new Error('Failed to send message');

            const data: Message = await response.json();
            setMessages((prevMessages) => [...prevMessages, data]);
            socket?.emit('message', JSON.stringify(data));

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!parsedUser) return null;

    const filteredUsers = users.filter((user) => user.Username !== parsedUser.Username);

    const welcomeMessage = filteredUsers.length
        ? `Welcome ${parsedUser.Username}. You have ${filteredUsers.length} friends online.`
        : 'Welcome, you have no friends online.';

    return (
        <div className="flex min-h-screen">
            <aside className="w-1/4 bg-gray-200 p-4">
                <h2 className="text-xl font-semibold mb-4">Friends</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                    Profile
                </button>
                <ul className="space-y-2">
                    {filteredUsers.map((user) => (
                        <li
                            key={user.id}
                            className="bg-white p-4 rounded-md shadow-md flex gap-3"
                            onClick={() => setActiveUser({ Username: user.Username, id: user.id })}
                        >
                            <div className="h-10 w-10 bg-blue-950 rounded-full flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">{user.Username[0]}</span>
                            </div>
                            <div className="flex mt-2">{user.Username}</div>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="flex-grow flex flex-col">
                <nav className="flex items-center bg-green-600 w-full h-16 p-4 gap-4">
                    <div className="h-10 w-10 bg-blue-950 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl">{parsedUser.Username[0]}</span>
                    </div>
                    <h2 className="text-white text-xl">{welcomeMessage}</h2>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            navigate('/');
                        }}
                        className="ml-auto bg-white text-blue-950 py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Logout
                    </button>
                </nav>
                <main className="flex-grow p-8">
                    {activeUser ? (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Chat with {activeUser.Username}</h2>
                            <ul>
                                {messages
                                    .sort((a, b) =>
                                        new Date(a.createdAt).getTime() -
                                        new Date(b.createdAt).getTime()
                                    )
                                    .map((message) => (
                                        <li
                                            key={message.id}
                                            className={`p-4 rounded-md shadow-md max-w-xs mb-4 ${
                                                message.senderId === parsedUser?.userId
                                                    ? 'bg-gray-400 text-black self-start mr-auto'
                                                    : 'bg-gray-300 text-black self-end ml-auto'
                                            }`}
                                        >
                                            <p>{message.content}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(message.createdAt).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                            <div className="fixed bottom-0 left-1/4 w-3/4 flex gap-2 bg-white p-4 border-t">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-grow p-2 border rounded-md"
                                    placeholder="Type your message..."
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition duration-300"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500 text-lg">Select a friend to start chatting.</p>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;