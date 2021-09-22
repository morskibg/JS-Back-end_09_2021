const http = require('http');
const config = require('./config');
const router = require('./routes/router').router;

const host = config.host
const port = config.port

const server = http.createServer(router);

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});