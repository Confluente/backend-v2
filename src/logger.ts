let bunyan = require('bunyan');

function reqSerializer(req: { connection: any; method: any; url: any; headers: any; }) {
    if (!req || !req.connection) {
        return req;
    }

    return {
        method: req.method,
        url: req.url,
        headers: req.headers
        // remoteAddress: req.connection.remoteAddress,
        // remotePort: req.connection.remotePort
    };
}

let logger = bunyan.createLogger({
    name: 'gb24Backend',
    serializers: {
        err: bunyan.stdSerializers.err,
        req: reqSerializer
    },
    env: process.env.NODE_ENV
});

module.exports = logger;
