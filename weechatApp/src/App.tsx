import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './register';
import Login from './login';
import HomePage from './homePage';
import Dashboard from './dashboard';
import { UpdateProfile } from './profile';
import { io, Socket } from 'socket.io-client';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3007', {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.io connection established');
    });

    newSocket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.io connection closed');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('message', message);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/profile' element={<UpdateProfile />} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;