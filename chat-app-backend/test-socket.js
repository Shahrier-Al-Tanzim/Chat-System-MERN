const { io } = require("socket.io-client");

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTcyNzdjZGUwYzBkZGMwMzhlYTY1NCIsInVzZXJuYW1lIjoiYWxpY2UiLCJpYXQiOjE3NTQ5NTg0OTgsImV4cCI6MTc1NTU2MzI5OH0.OijnM957_8xoPrSXFiU0r6pahb3jYvauyiKr5ZrUPU4";
const socket = io("http://localhost:5000", {
  auth: { token: TOKEN } // This matches how we coded server auth
});

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // Join a test room
  socket.emit("joinRoom", "general");

  // Send a test message
  socket.emit("message", {
    room: "general",
    content: "Hello from test client!"
  });
});

socket.on("message", (msg) => {
  console.log("📩 Message received:", msg);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});
