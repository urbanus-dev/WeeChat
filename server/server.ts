import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import languageRoutes from './routes/languageRoutes';
import { createChat } from './controllers/chats';
import { createMessage, getMessages } from './controllers/messages';
import { translateMessage } from './controllers/messageTranslation';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getUserById } from './controllers/UserControllers';

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
const port = process.env.PORT || 3007;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/chats/createChat', createChat);
app.get('/api/messages/getMessages', getMessages);
app.post('/api/messages/createMessage', createMessage);
app.post('/api/messages/translateMessage', async (req: Request, res: Response) => {
  const { text, targetLang } = req.body;
  try {
    const translatedText = await translateMessage(text, targetLang);
    res.json({ translatedText });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', async (message) => {
    console.log(`Received message: ${message}`);
    const parsedMessage = JSON.parse(message);
    try {
      const receiver = await getUserById(parsedMessage.receiverId);
      const targetLang = receiver?.languagePreference || 'en'; 

      try {
        const translatedContent = await translateMessage(parsedMessage.content, targetLang);
        parsedMessage.content = translatedContent;
      } catch (error) {
        console.error('Error translating message:', error);
      }

      io.emit('message', JSON.stringify(parsedMessage));
    } catch (error) {
      console.error('Error fetching user language preference:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };