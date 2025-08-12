import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';

import { connectDB } from './config/db';
import authRoutes from './routes/auth';
import setupSocket from './socket';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Chat App Backend');
});
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

// Initialize Socket.IO server
setupSocket(server);

const PORT: number = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err: Error) => {
    console.error('Failed to start Server', err);
    process.exit(1);
  });
