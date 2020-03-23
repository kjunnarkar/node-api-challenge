const express = require('express');
const projectRouter = require('./router/projectRouter');
const actionRouter = require('./router/actionRouter');

const server = express();

// middleware
server.use(express.json());

// routers
server.use('/api/project', projectRouter);
server.use('/api/action', actionRouter);

// default route handler for root URL
server.get('/', (req, res) => {
    res.send(`<h2>Kiran's Node Api Challenge</h2>`);
});

module.exports = server;
