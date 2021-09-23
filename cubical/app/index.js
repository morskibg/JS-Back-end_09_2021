
const env = process.env.NODE_ENV || 'development';

const config = require('./config/env_config')[env];
const express = require('express');
const app = express();

require('./config/express_config')(app);
require('./config/routes_config')(app);




  


app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));

