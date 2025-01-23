const express = require('express');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(express.static(__dirname)); // Поддержка статических файлов

https
    .createServer(
        {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert'),
        },
        app
    )
    .listen(3000, () => {
        console.log('HTTPS server running on https://localhost:3000');
    });
