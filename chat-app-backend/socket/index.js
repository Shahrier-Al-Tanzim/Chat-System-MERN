// socket/index.js
const { Server } = require('socket.io');
const { verifyToken } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

function setupSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*", methods: ['GET', 'POST'] },
    });

    // Middleware for socket auth
    io.use((socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                (socket.handshake.headers?.authorization?.split(' ')[1]);

            if (!token) return next(new Error('Authentication error: token missing'));

            const payload = verifyToken(token);
            socket.user = payload;
            next();
        } catch (err) {
            console.error('Socket auth error', err);
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id, 'user:', socket.user?.username || socket.user?.id);

        socket.join('general');

        socket.on('joinRoom', async (room) => {
            socket.join(room);

            // Send history from DB
            const history = await Message.find({ room }).sort({ timestamp: 1 }).limit(50);
            socket.emit('history', history);

            socket.emit('joined', room);
        });

        socket.on('message', async ({ room = 'general', content }) => {
            const message = {
                room,
                sender: { id: socket.user.id, username: socket.user.username },
                content,
                timestamp: new Date(),
            };

            await Message.create(message); // Save in DB
            io.to(room).emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });

    return io;
}

module.exports = setupSocket;



// const server = http.createServer(app);
// const { Server } = require('socket.io');

// const io = new Server(server, {
//     cors: { origin: "*", methods: ['GET', 'POST'] },
// });

// // *** SOCKET.IO MODIFIED ***
// // Socket authentication middleware
// io.use((socket, next) => {
//     try {
//         // Accept token from handshake.auth.token or Authorization header
//         const token =
//             socket.handshake.auth?.token ||
//             (socket.handshake.headers &&
//                 socket.handshake.headers.authorization &&
//                 socket.handshake.headers.authorization.split(' ')[1]);

//         if (!token) return next(new Error('Authentication error: token missing'));

//         // verifyToken should return decoded payload or throw error
//         const payload = verifyToken(token);
//         socket.user = payload;
//         next();
//     } catch (err) {
//         console.error('Socket auth error', err);
//         next(new Error('Authentication error'));
//     }
// });

// // *** SOCKET.IO MODIFIED ***
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id, 'user:', socket.user?.username || socket.user?.id);

//     // default join to 'general' room
//     socket.join('general');

//     socket.on('joinRoom', (room) => {
//         socket.join(room);
//         socket.emit('joined', room);
//     });

//     // *** FIXED typo in event name from 'messae' to 'message' ***
//     socket.on('message', ({ room = 'general', content }) => {
//         const message = {
//             sender: { id: socket.user.id, username: socket.user.username },
//             content,
//             timestamp: new Date(),
//         };
//         io.to(room).emit('message', message);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected', socket.id);
//     });
// });
