import { Server, Socket } from 'socket.io';
import { verifyToken } from '../middleware/authMiddleware';
import Message, { IMessage } from '../models/Message'; // make sure Message default export and IMessage interface exist

interface JwtPayload {
  id: string;
  username: string;
}

export default function setupSocket(server: any): Server {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) return next(new Error('Authentication error: token missing'));

      const payload = verifyToken(token) as JwtPayload;
      (socket as any).user = payload;
      next();
    } catch (err) {
      console.error('Socket auth error', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const user = (socket as any).user as JwtPayload;
    console.log('User connected:', socket.id, 'user:', user?.username || user?.id);

    socket.join('general');

    socket.on('joinRoom', async (room: string) => {
      socket.join(room);
      try {
        // Explicitly type the history variable for clarity
        const history: IMessage[] = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
        socket.emit('history', history);
      } catch (err) {
        console.error('Error fetching history:', err);
        socket.emit('history', []);
      }
      socket.emit('joined', room);
    });

    socket.on('message', async ({ room = 'general', content }: { room?: string; content: string }) => {


      // Use a plain object for message creation and emission
      const message = {
        room,
        sender: { id: user.id, username: user.username },
        content,
        timestamp: new Date(),
      };

      await Message.create(message);
      io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);
    });
  });

  return io;
}
