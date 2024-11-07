import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import cors from 'cors';
import languageRoutes from './routes/languageRoutes'

dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
const port = process.env.PORT || 3007;
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/languages', languageRoutes )

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app };