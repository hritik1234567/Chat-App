const http = require('http');
const { Server } = require('socket.io');


// Create an HTTP server on port 8000
const httpServer = http.createServer((req, res) => {
  // Handle HTTP requests if needed
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, this is your HTTP server.');
});

// Create a Socket.IO server attached to the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5500", // Replace with your web page's origin
    methods: ["GET", "POST"] // Specify allowed HTTP methods
  }
});

// Define an object to store user data (e.g., usernames)
const users = {};

// Define Socket.IO event handlers
io.on('connection', (socket) => {
    //console.log('A user connected:', socket.id);
  socket.on('user-joined', (user) => {
    // Store the username in the users object using the socket ID as the key
   // console.log("New user", user);
    users[socket.id] = user;
    
    // Broadcast a 'user-joined' event to all clients with the new username
    socket.broadcast.emit('user-joined', user);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('recieve', { messages: message, user: users[socket.id] });
  });

  // Handle other socket events here
  socket.on('disconnect', (message) => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });


 
});

// Start the HTTP server on port 80
httpServer.listen(80, () => {
  console.log('Socket.IO server is running on port 80');
});
