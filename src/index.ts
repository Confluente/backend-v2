import {app, setupServer} from './expressServer';
import {db} from "./db";
import {logger} from "./logger";

const httpServer = require('http').createServer(app);
const https = require('https');
const fs = require('fs');

(async () => {

    await db.sync();

    await setupServer(app);

    if (process.env.NODE_ENV === "development") {
        process.env.PORT = "81";
    } else {
        process.env.PORT = "80";
    }

    // Set port server
    const port: number = !Number.isNaN(Number(process.env.PORT)) ? Number(process.env.PORT) : 3000;

    // Start server
    httpServer.listen(port, function(): any {
        logger.info('Listening on port ' + port);
    });

    // Only for live website version
    if (process.env.NODE_ENV === "production") {
        const httpsServer = https.createServer({
            key: fs.readFileSync('../../../etc/letsencrypt/live/hsaconfluente.nl-0001/privkey.pem'),
            cert: fs.readFileSync('../../../etc/letsencrypt/live/hsaconfluente.nl-0001/cert.pem'),
            ca: fs.readFileSync('../../../etc/letsencrypt/live/hsaconfluente.nl-0001/fullchain.pem')
        }, app);

        httpsServer.listen(443, function(): void {
            logger.info('Listening...');
        });
    }
})();
