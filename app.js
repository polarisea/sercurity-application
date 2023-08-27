const http = require('http');
const fs = require('fs');
const server = http.createServer((req,res)=>{
    fs.readFile('index.html', 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
    
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
});
const io = require('socket.io')(server);

const nicknames = [];

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });

  socket.on("join chat", nickname=>{
    if(nicknames.includes(nickname)){
        socket.emit("join chat", "");
    } else {
        nicknames.push(nickname);
        socket.emit("join chat", nickname);
    }
  });

socket.on('send text', (data) => {
      io.emit('receive text', data); 
    });
    socket.on("send image", data =>{
        io.emit('receive image', data)
    })
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});