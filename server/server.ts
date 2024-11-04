import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
import userRoutes from './routes/userRoutes';
// import cookieParser from 'cookie-parser';

export {app};
dotenv.config();
const app = express();
const port = process.env.PORT || 3007;
app.use(express.json());

app.use('/api/users', userRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});