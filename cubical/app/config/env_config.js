require('dotenv').config()

const config = {
    development: {
        port: process.env.PORT || 3000
    },
    production: {}
};

module.exports = config;