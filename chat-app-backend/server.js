require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Chat App Backend');
});
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

const setupSocket = require('./socket');
setupSocket(server);

const PORT = process.env.PORT || 5000;
connectDB()
    .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((err) => {
        console.error('Failed to start Server', err);
        process.exit(1);
    });
