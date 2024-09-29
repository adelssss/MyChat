const express = require('express'); 
const http = require('http');
const EventEmitter = require('events'); 
const path = require('path'); 

const app = express(); 
const server = http.createServer(app);
const eventEmitter = new EventEmitter(); 
const PORT = process.env.PORT || 3000; 

app.use('/static', express.static(path.join(__dirname, 'mychat')));

app.get('/', (req, res) => {
    res.send('hi');
});

app.get('/json', (req, res) => {
    res.json({
        text: 'hi',
        numbers: [1, 2, 3]
    });
});

app.get('/echo', (req, res) => {
    const message = req.query.message || ''; 
    const response = {
        normal: message,
        shouty: message.toUpperCase(),
        charCount: message.length,
        backwards: message.split('').reverse().join('') 
    };
    res.json(response); 
});

app.get('/chat', (req, res) => {
    const message = req.query.message;
    eventEmitter.emit('message', message); 
    res.send('Message sent'); 
});
// Sets up a Server-Sent Events (SSE) connection for real-time updates
app.get('/sse', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream'); 
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendMessage = (message) => {
        res.write(`data: ${message}\n\n`); 
    };
    eventEmitter.on('message', sendMessage);

    req.on('close', () => {
        eventEmitter.removeListener('message', sendMessage); 
        res.end();
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); 
});

