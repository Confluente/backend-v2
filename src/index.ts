let log = require('./logger');
let expressServer = require('./expressServer');
let httpServer = require('http').createServer(expressServer);
const https = require('https');
const fs = require('fs');

// Only for live website version
// var httpsServer = https.createServer({
//     key: fs.readFileSync('../../../etc/letsencrypt/live/hsaconfluente.nl-0001/privkey.pem'),
//     cert: fs.readFileSync('../../../etc/letsencrypt/live/hsaconfluente.nl-0001/cert.pem'),
//     ca: fs.readFileSync('../../../etc/letsencrypt/live/hsaconfluente.nl-0001/fullchain.pem')
// }, expressServer);


// Set port server
let port: number = !Number.isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 3000;

// Start server
httpServer.listen(port, function() {
    log.info('Listening on port ' + port);
});

// Only for live website version
// httpsServer.listen(443, function() {
//     log.info('Listening...')
// });
