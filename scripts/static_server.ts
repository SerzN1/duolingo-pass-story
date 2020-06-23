const fs = require('fs');
const https = require('https');

const STATIC_FOLDER = '/static';

https.createServer(function (req, res) {
    console.log(__dirname + STATIC_FOLDER + req.url);
    fs.readFile(__dirname + STATIC_FOLDER + req.url, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(8080);