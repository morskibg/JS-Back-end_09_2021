
const env = process.env.NODE_ENV || 'development';

const config = require('./config/env_config')[env];
const express = require('express')
const app = express();

require('./config/express_config')(app);
require('./config/routes_config')(app);

app.get('/',(req, res) =>{
    res.render('index')
});

app.get('/test',(req, res) =>{
    res.send('probaa')
});

  


app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));

// app.get('/', (req, res) => {
//   res.send('Hello world');
// });

// app.get('/:name', (req, res) => {
//   const name = req.params.name;
//   res.send(`Hello ${name}`);
// });

// app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
