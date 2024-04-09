const app = require('./app');
const config = require('./config/config');
const http = require('http');
const server = http.createServer(app)
//mongoose connection
require('./config/database');

server.listen(config.port, () => {
    console.log(`Listening to port ${config.port}`);
});