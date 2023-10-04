var express = require('express');
var http = require('http');
const moment = require('moment');  //moment package
const nodemailer = require('nodemailer'); // Import the sendEmail function
var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use the email service you prefer
  auth: {
      user: 'charrahhajar@gmail.com', // Your email address
      pass: 'your-password', // Your email password (use environment variables for security)
  },
});

app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


var name;

io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  	io.emit('chat message', `---${name} joined the chat---`);
  });
      // Send an email notification when a user joins
      const mailOptions = {
        from: 'charrahhajar@gmail.com',
        to: 'charrahhajar99@gmail.com', // Recipient's email address
        subject: 'User Joined Chat',
        text: `${name} has joined the chat at ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `---${name} left the chat---`);
    
  });
  socket.on('chat message', (msg) => {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');   //time of message during conversation
    io.emit('chat message', `[${timestamp}] ${msg}`);
  });
//sending email when the user joins or leaves the chat conversation
});

server.listen(3000, () => {
  console.log('Server listening on :3000');
});
